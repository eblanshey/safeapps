import {getOnce} from '../firebaseRepository';
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

  const { request, collection, entity, types, endpoint, entityOrCollection, id, name, data } = callAPI;

  if (!request || ['fetch', 'put', 'push', 'delete'].indexOf(request) < 0) {
    throw new Error('Request must be of type fetch, put, push, or delete');
  }
  if ((request === 'put' || request === 'push') && !data) {
    throw new Error('If putting/pushing new data, you must supply the data.');
  }
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (endpoint.startsWith('http') || endpoint.startsWith('safe:')) {
    throw new Error('Don\'t pass the entire url, just the URI.');
  }
  if (!entityOrCollection || (entityOrCollection !== 'collection' && entityOrCollection !== 'entity')) {
    throw new Error('Specify whether this is a collection or entity request.')
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

  function actionWith(data, stage) {
    const finalAction = Object.assign({}, action, data);
    finalAction[API] = {
      stage,
      entityOrCollection: finalAction[CALL_API].entityOrCollection,
      name: finalAction[CALL_API].name,
      id: finalAction[CALL_API].id,
      data: finalAction[CALL_API].data,
    }
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }, 'request'));

  return getOnce(endpoint).then(
      data => next(actionWith({type: successType, data}, 'success')),
      error => {
        addGlobalMessage('error', error.message || 'Something bad happened');
        return next(actionWith({type: failureType}, 'failure'))
      }
  );
};
