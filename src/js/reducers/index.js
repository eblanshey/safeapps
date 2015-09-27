import {fromJS} from 'immutable';

import DefaultState from './defaultState';
import * as reducers from './core';

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

export default function(state = DefaultState, action) {
  // Meh, no magic use of "combineReducers" here
  return state
    .update('messages', messagesState => messages(messagesState, action))
    .update('auth', authState => auth(authState, action));
}