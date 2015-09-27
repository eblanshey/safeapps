import * as actionTypes from './actionTypes';
import * as Firebase from '../firebaseRepository';
import {addGlobalMessage, signupFailure, loginSuccessful, signupCompleted, login, loginFailure, signupRequest} from './index';

export function submitEmailLogin(email, password) {
  return function(dispatch, getState) {
    if (getState().getIn(['auth', 'authData'])) {
      // we're already logged in
      return null;
    }

    dispatch(login());

    return Firebase
      .loginWithEmail(email, password)
      .then(authData => {
        dispatch(loginSuccessful(authData));
      })
      .catch(error => {
        dispatch(loginFailure());
        dispatch(addGlobalMessage('error', error));
      });
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
        dispatch(addGlobalMessage('success', 'You have successfully created an account! You may proceed to log in.'));
      })
      .catch(error => {
        dispatch(signupFailure());
        dispatch(addGlobalMessage('error', error));
      });
  }
}