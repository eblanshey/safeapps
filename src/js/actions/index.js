import * as actionTypes from './actionTypes';
import {CALL_API} from '../middleware/api';
import config from '../config';

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

export function fetchApprovedAppCollection() {
  return {
      [CALL_API]: {
        types: [actionTypes.APPROVED_APPS_REQUEST, actionTypes.APPROVED_APPS_SUCCESS, actionTypes.APPROVED_APPS_FAILURE],
        endpoint: `users/${config.adminId}/approvedApps`,
        entityOrCollection: 'collection',
        name: 'approvedApps'
      }
  };
}

export function fetchAppEntity(userid, appid) {
  return {
      [CALL_API]: {
        types: [actionTypes.APP_REQUEST, actionTypes.APP_SUCCESS, actionTypes.APP_FAILURE],
        endpoint: `users/${userid}/apps/${appid}`,
        entityOrCollection: 'entity',
        id: appid,
        name: 'apps'
      }
  };
}

export function fetchAppExtendedEntity(userid, appid) {
  return {
      [CALL_API]: {
        types: [actionTypes.APP_REQUEST, actionTypes.APP_SUCCESS, actionTypes.APP_FAILURE],
        endpoint: `users/${userid}/appsExtended/${appid}`,
        entityOrCollection: 'entity',
        id: appid,
        name: 'appsExtended'
      }
  };
}

export function fetchThumbEntity(userid, thumbid) {
  return {
      [CALL_API]: {
        types: [actionTypes.THUMB_REQUEST, actionTypes.THUMB_SUCCESS, actionTypes.THUMB_FAILURE],
        endpoint: `users/${userid}/thumbs/${thumbid}`,
        entityOrCollection: 'entity',
        id: thumbid,
        name: 'thumbs'
      }
  };
}
