import * as actionTypes from './actionTypes';
import {CALL_API} from '../middleware/api';
import config from '../config';

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
  return buildApiAction('fetch', types, 'collection', `${status}Apps`, adminid);
}

export function fetchAppEntity(userid, appid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction('fetch', types, 'entity', 'apps', userid, appid);
}

export function fetchAppExtendedEntity(userid, appid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction('fetch', types, 'entity', 'appsExtended', userid, appid);
}

export function fetchThumbEntity(userid, thumbid) {
  const types = [actionTypes.FETCH_ENTITY_REQUEST, actionTypes.FETCH_ENTITY_SUCCESS, actionTypes.FETCH_ENTITY_FAILURE];
  return buildApiAction('fetch', types, 'entity', 'thumbs', userid, thumbid);
}

function buildApiAction(request, types, entityOrCollection, name, userid, id) {
  return {
    [CALL_API]: {
      request,
      types,
      entityOrCollection,
      name,
      id,
      endpoint: `users/${userid}/${name}`+(entityOrCollection === 'entity' ? `/${id}` : '')
    }
  }
}