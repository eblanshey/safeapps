import * as actionTypes from './actionTypes';
import * as Firebase from '../firebaseRepository';
import {addGlobalMessage, signupFailure, loginSuccessful, signupCompleted, login, loginFailure, signupRequest} from './index';

function doLogin(dispatch, email, password) {
  dispatch(login());

  return Firebase
    .loginWithEmail(email, password)
    .then(authData => {
      // Don't dispatch here, we have a global listener being used
      // That's because when the app is reloaded, the user is auto-logged back in without a form.
      // This listener will know to set login data, even when using this form.
      return true;
    }, error => {
      dispatch(loginFailure());
      dispatch(addGlobalMessage('error', error));
    });
}

export function submitEmailLogin(email, password) {
  return function(dispatch, getState) {
    return doLogin(dispatch, email, password);
  }
}

export function signup(email, password) {
  return function(dispatch) {
    dispatch(signupRequest());

    return Firebase
      .signupWithEmail(email, password)
      .then(authData => {
        // We won't actually use the authData here. They still need to log in.
        dispatch(signupCompleted());
        return doLogin(dispatch, email, password)
          .then(() => {
            dispatch(addGlobalMessage('success', 'You have successfully created an account! Welcome!'))
          });
      }, error => {
        dispatch(signupFailure());
        dispatch(addGlobalMessage('error', error));
      });
  }
}