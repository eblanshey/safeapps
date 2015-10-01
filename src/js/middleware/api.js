import {getOnce} from '../firebaseRepository';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({ json, response }))
  ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);
      const nextPageUrl = getNextPageUrl(response) || undefined;

      return Object.assign({},
        normalize(camelizedJson, schema),
        { nextPageUrl }
      );
    });
}

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('CALL_API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { collection, entity, types } = callAPI;

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (endpoint.startsWith('http') || endpoint.startsWith('safe:')) {
    throw new Error('Don\'t pass the entire url, just the URI.');
  }
  if (!collection && !entity) {
    throw new Error('Specify either a collection or entity name.');
  }
  if (collection && typeof collection !== 'string') {
    throw new Error('You must specify the collection as a string.');
  }
  if (entity && typeof entity !== 'string') {
    throw new Error('You must specify the entity as a string.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return getOnce(endpoint).then(
      data => next(actionWith({
          data,
          type: successType
      })),
      error => next(actionWith({
        type: failureType,
        error: error.message || 'Something bad happened'
      }))
  );
};
