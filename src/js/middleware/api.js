import * as Firebase from '../firebaseRepository';
import {addGlobalMessage} from '../actions';
import uuid from '../utils/uuid';

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('CALL_API');
// Action key that carries the results of calling the API
export const API = Symbol('API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { collection, entity, types, userid, name, data, onSuccess, onFailure } = callAPI;
  let { id, endpoint } = callAPI;

  let request = types[0].substr(0, types[0].indexOf('_')),
    entityOrCollection = isEntityOrCollection(types);

  if (request === 'PUT' && !data) {
    throw new Error('PUT and PUSH requests must provide data.');
  }
  if (entityOrCollection === 'entity' && ! id) {
    throw new Error('An ID must be provided with entity requests.');
  }
  if (!name) {
    throw new Error('Specify the entity/collection name.');
  }
  if (typeof name !== 'string') {
    throw new Error('You must specify the collection as a string.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }
  if (request === 'PUT' && !id) {
    throw new Error('Every put must have an ID.');
  }

  endpoint = endpoint ? endpoint : generateApiEndpoint(userid, name, id);

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    finalAction[API] = {
      name: finalAction[CALL_API].name,
      id: finalAction[CALL_API].id,
      data: finalAction[CALL_API].data
    }
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [typeRequest, typeSuccess, typeFailure] = types;
  next(actionWith({ type: typeRequest }));

  let successClosure = result => {
    if (onSuccess) {
      store.dispatch(onSuccess());
    }

    if (request === 'FETCH') {
      var returnData = result;
    } else if (request === 'PUT') {
      var returnData = data;
    }

    return next(actionWith({type: typeSuccess, data: returnData}));
  };
  let errorClosure = error => {
    if (onFailure) {
      store.dispatch(onFailure(data.message));
    }

    addGlobalMessage('error', error.message || 'Something bad happened');
    return next(actionWith({type: typeFailure}))
  };

  switch (request) {
    case 'FETCH':
      return Firebase.get(endpoint).then(successClosure, errorClosure);
    case 'PUT':
      return Firebase.set(endpoint, data).then(successClosure, errorClosure);
    case 'DELETE':
      return Firebase.remove(endpoint).then(successClosure, errorClosure);
    default:
      throw new Error('Got invalid request', request);
  }
};

function isEntityOrCollection(types) {
  if (types[0].indexOf('COLLECTION') > -1) {
    return 'collection';
  } else if (types[0].indexOf('ENTITY') > -1) {
    return 'entity';
  } else {
    throw new Error('Got invalid type', types[0]);
  }
}

function generateApiEndpoint(userid, name, id) {
  return `users/${userid}/${name}`+(id ? `/${id}` : '');
}