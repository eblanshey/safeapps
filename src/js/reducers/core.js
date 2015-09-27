import {Map} from 'immutable';

function isValidMessageType(type) {
  return ['error', 'success'].indexOf(type) < 0 ? false : true;
}

// Global messages
export function addGlobalMessage(messages, type, text) {
  if (!isValidMessageType(type))
    return messages;

  return messages.set(type, messages.get(type).push(Map({
    text
  })));
}
export function removeGlobalMessage(messages, type, text) {
  if (!isValidMessageType(type))
    return messages;
  
  const index = messages.get(type).findIndex((obj) => {
    return obj.get('text') === text
  });

  if (index > -1) {
    return messages.set(type, messages.get(type).delete(index));
  } else {
    return messages;
  }
}

// Login
export function setAuthData(authState, newAuthData) {
  const newState = authState
    .set('isLoggedIn', newAuthData ? true : false)
    .set('isLoggingIn', false)
    .set('authData', newAuthData ? Map(newAuthData) : null);

  // If logged out, then definitely user should not be set as admin
  if(!newAuthData) {
    return newState.set('isAdmin', false);
  } else {
    return newState;
  }
}
export function loggingIn(authState) {
  return authState
    .set('isLoggingIn', true);
}
export function loginFailure(authState) {
  return authState
    .set('isLoggingIn', false);
}

// Signup handlers
export function signupRequest(signupState) {
  return signupState.set('isSigningUp', true);
}
export function signupSuccess(signupState) {
  return signupState
    .set('isSigningUp', false)
    .set('didCreateLogin', true);
}
export function signupFailure(signupState) {
  return signupState
    .set('isSigningUp', false)
    .set('didCreateLogin', false);
}