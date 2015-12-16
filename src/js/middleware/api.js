import * as Firebase from '../firebaseRepository';
import {addGlobalMessage} from '../actions';

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

  const { collection, entity, types, id, name, data, onSuccess, onFailure } = callAPI;

  let entityOrCollection = isEntityOrCollection(types),
    endpoint = generateApiEndpoint(callAPI),
    request = types[0].substr(0, types[0].indexOf('_'));

  if (['PUT', 'PUSH'].indexOf(request) > -1 && !data) {
    throw new Error('PUT and PUSH requests must provide data.');
  }
  if (endpoint.startsWith('http') || endpoint.startsWith('safe:')) {
    throw new Error('Don\'t pass the entire url, just the URI.');
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

  let successClosure = data => {
    if (onSuccess) {
      store.dispatch(onSuccess(data));
    }

    return next(actionWith({type: typeSuccess, data}));
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
      return Firebase.getOnce(endpoint).then(successClosure, errorClosure);
    case 'PUT':
      return Firebase.set(endpoint, data).then(successClosure, errorClosure);
    case 'PUSH':
      return Firebase.push(endpoint, data).then(successClosure, errorClosure);
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

function generateApiEndpoint(options) {
  return options.endpoint ?
    options.endpoint :
    `users/${options.userid}/${options.name}`+(options.entityOrCollection === 'entity' ? `/${options.id}` : '');
}