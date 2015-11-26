import * as actionTypes from './actionTypes';
import * as Firebase from '../firebaseRepository';
import * as actions from './index';

function doLogin(dispatch, email, password) {
  dispatch(actions.login());

  return Firebase
    .loginWithEmail(email, password)
    .then(authData => {
      // Don't dispatch here, we have a global listener being used
      // That's because when the app is reloaded, the user is auto-logged back in without a form.
      // This listener will know to set login data, even when using this form.
      return true;
    }, error => {
      dispatch(actions.loginFailure());
      dispatch(actions.addGlobalMessage('error', error));
    });
}

export function submitEmailLogin(email, password) {
  return function(dispatch, getState) {
    return doLogin(dispatch, email, password);
  }
}

export function signup(email, password) {
  return function(dispatch) {
    dispatch(actions.signupRequest());

    return Firebase
      .signupWithEmail(email, password)
      .then(authData => {
        // We won't actually use the authData here. They still need to log in.
        dispatch(actions.signupCompleted());
        return doLogin(dispatch, email, password)
          .then(() => {
            dispatch(actions.addGlobalMessage('success', 'You have successfully created an account! Welcome!'))
          });
      }, error => {
        dispatch(actions.signupFailure());
        dispatch(actions.addGlobalMessage('error', error));
      });
  }
}

export function loadApprovedAppCollection() {
  return (dispatch, getState) => {
    const apps = getState().getIn(['collections', 'approvedApps']);

    if (apps && apps.size > 0) {
      return null;
    }

    return dispatch(actions.fetchApprovedAppCollection());
  }
}

export function loadAppEntity(userid, appid) {
  return (dispatch, getState) => {
    const app = getState().getIn(['entities', 'apps', appid]);

    if (app) {
      return null;
    }

    return dispatch(actions.fetchAppEntity(userid, appid));
  }
}
export function loadAppExtendedEntity(userid, appid) {
  return (dispatch, getState) => {
    const app = getState().getIn(['entities', 'appsExtended', appid]);

    if (app) {
      return null;
    }

    return dispatch(actions.fetchAppExtendedEntity(userid, appid));
  }
}
export function loadThumbEntity(userid, thumbid) {
  return (dispatch, getState) => {
    const app = getState().getIn(['entities', 'thumbs', thumbid]);

    if (app) {
      return null;
    }

    return dispatch(actions.fetchThumbEntity(userid, thumbid));
  }
}