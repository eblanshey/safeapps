import {Map} from 'immutable';

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
  if (!action[API] || action[API].entityOrCollection !== 'collection') {
    return collectionState;
  }

  const defaultCollection = Map({
    isLoading: false,
    data: Map()
  });

  switch (action[API].stage) {
    case 'request':
      return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionRequest(collection));
    case 'success':
      return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionSuccess(collection, action.data));
    case 'failure':
      return collectionState.update(action[API].name, defaultCollection, collection => reducers.setCollectionFailure(collection, action.error));
    default:
      throw new Error(`Got invalid API stage: ${action[API].stage}`);
  }
}

function entities(entityState, action) {
  if (!action[API] || action[API].entityOrCollection !== 'entity') {
    return entityState;
  }

  const defaultEntity = Map({
    isLoading: false,
    data: null
  });

  switch (action[API].stage) {
    case 'request':
      return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntityRequest(entity));
    case 'success':
      return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntitySuccess(entity, action.data));
    case 'failure':
      return entityState.updateIn([action[API].name, action[API].id], defaultEntity, entity => reducers.setEntityFailure(entity, action.error));
    default:
      throw new Error(`Got invalid API stage: ${action[API].stage}`);
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