import * as actionTypes from './actionTypes';

// Global messages
export function addGlobalMessage(messageType, text) {
  return {
    type: actionTypes.ADD_GLOBAL_MESSAGE,
    messageType,
    text
  };
}
export function removeGlobalMessage(messageType, text) {
  return {
    type: actionTypes.REMOVE_GLOBAL_MESSAGE,
    messageType,
    text
  };
}

// Login
export function login() {
  return {
    type: actionTypes.LOGIN
  };
}
export function loginFailure() {
  return {
    type: actionTypes.LOGIN_FAILURE
  };
}
export function loginSuccessful(authData) {
  return {
    type: actionTypes.LOGIN_SUCCESSFUL,
    authData
  };
}

// Signup
export function signupRequest() {
  return {
    type: actionTypes.SIGNUP_REQUEST
  };
}
export function signupCompleted() {
  return {
    type: actionTypes.SIGNUP_COMPLETED
  }
}
export function signupFailure() {
  return {
    type: actionTypes.SIGNUP_FAILURE
  }
}
