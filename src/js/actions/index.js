import * as actionTypes from './actionTypes';
import {CALL_API} from '../middleware/api';
import config from '../config';
import {generateUUID} from '../utils/uuid';

const adminid = config.adminId;

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

export function fetchAppCollection(status) {
  const types = [actionTypes.FETCH_COLLECTION_REQUEST, actionTypes.FETCH_COLLECTION_SUCCESS, actionTypes.FETCH_COLLECTION_FAILURE];
  return buildApiAction({types, name: `${status}Apps`, userid: adminid});
}

export function fetchAppEntity(userid, appid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction({types, name: 'apps', userid, id: appid});
}

export function fetchAppExtendedEntity(userid, appid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction({types, name: 'appsExtended', userid, id: appid});
}

export function fetchThumbEntity(userid, thumbid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction({types, name: 'thumbs', userid, id: thumbid});
}

export function putNewAppEntity(userid, appData) {
  const types = [actionTypes.PUT_ENTITY_REQUEST, actionTypes.PUT_ENTITY_SUCCESS, actionTypes.PUT_ENTITY_FAILURE],
    id = generateUUID();

  return buildApiAction({
    types, name: 'apps', userid,
    data: appData, id: id,
    onSuccess: () => {
      const types1 = [actionTypes.PUT_COLLECTION_REQUEST, actionTypes.PUT_COLLECTION_SUCCESS, actionTypes.PUT_COLLECTION_FAILURE];
      return buildApiAction({types: types1, name: 'pendingApps', userid: adminid, data: {userid, submitted: Date.now()}, id});
    }
  });
}

function buildApiAction(options) {
  return {
    [CALL_API]: options
  }
}