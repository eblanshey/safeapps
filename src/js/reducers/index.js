import {Map, fromJS} from 'immutable';

import DefaultState from './defaultState';
import * as reducers from './core';
import {API} from '../middleware/api';

function messages(messagesState, action) {
  switch(action.type) {
    case 'ADD_GLOBAL_MESSAGE':
      return reducers.addGlobalMessage(messagesState, action.messageType, action.text);
    case 'REMOVE_GLOBAL_MESSAGE':
      return reducers.removeGlobalMessage(messagesState, action.messageType, action.text);
  }

  return messagesState;
}

function auth(authState, action) {
  switch(action.type) {
    case 'LOGIN':
      return reducers.loggingIn(authState);
    case 'LOGIN_FAILURE':
      return reducers.loginFailure(authState);
    case 'LOGIN_SUCCESSFUL':
      return reducers.setAuthData(authState, action.authData);
  }

  return authState;
}

function signup(signupState, action) {
  switch(action.type) {
    case 'SIGNUP_REQUEST':
      return reducers.signupRequest(signupState);
    case 'SIGNUP_COMPLETED':
      return reducers.signupSuccessful(signupState);
    case 'SIGNUP_FAILURE':
      return reducers.signupFailure(signupState);
  }

  return signupState;
}

function collections(collectionState, action) {
  if (
    !action[API] ||
    [
      'FETCH_COLLECTION_REQUEST', 'FETCH_COLLECTION_SUCCESS', 'FETCH_COLLECTION_FAILURE',
      'PUT_COLLECTION_REQUEST', 'PUT_COLLECTION_SUCCESS', 'PUT_COLLECTION_FAILURE',
    ].indexOf(action.type) < 0
  ) {
    return collectionState;
  }

  const defaultCollection = Map({
    isLoading: false,
    data: null
  });

  if (action.type.indexOf('REQUEST') > -1) {
    return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionRequest(collection));
  } else if (action.type.indexOf('SUCCESS') > -1) {
    let request = action.type.substr(0, action.type.indexOf('_')),
      data;

    if (request === 'PUT') {
      // If a new app was PUT, it needs to be added to the existing collection of apps. If no collection exists
      // yet for whatever reason, create a new empty list.
      data = collectionState.getIn([action[API].name, 'data']);

      if (!data) {
        data = Map();
      }
      data = data.set(action[API].id, fromJS(action[API].data));
    } else if (request === 'FETCH') {
      // If we fetched a collection, then the data returned is the entire collection
      data = action.data;
    }

    return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionSuccess(collection, data));
  } else if (action.type.indexOf('FAILURE') > -1) {
    return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionFailure(collection, action.error));
  } else {
    throw new Error('Got invalid type', action.type);
  }
}

function entities(entityState, action) {
  if (
    !action[API] || [
      'FETCH_ENTITY_REQUEST', 'FETCH_ENTITY_SUCCESS', 'FETCH_ENTITY_FAILURE',
      'PUT_ENTITY_REQUEST', 'PUT_ENTITY_SUCCESS', 'PUT_ENTITY_FAILURE',
    ].indexOf(action.type) < 0
  ) {
    return entityState;
  }

  const defaultEntity = Map({
    isLoading: false,
    data: null
  });

  if (action.type.indexOf('REQUEST') > -1) {
    return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntityRequest(entity));
  } else if (action.type.indexOf('SUCCESS') > -1) {
    return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntitySuccess(entity, action.data));
  } else if (action.type.indexOf('FAILURE') > -1) {
    return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntityFailure(entity, action.error));
  } else {
    throw new Error('Got invalid type', action.type);
  }
}

export default function(state = DefaultState, action) {
  // Meh, no magic use of "combineReducers" here
  return state
    .update('messages', messagesState => messages(messagesState, action))
    .update('auth', authState => auth(authState, action))
    .update('collections', collectionState => collections(collectionState, action))
    .update('entities', entityState => entities(entityState, action));
}