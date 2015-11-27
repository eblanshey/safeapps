import {expect} from 'chai';
import {fromJS} from 'immutable';

import * as actionTypes from '../src/js/actions/actionTypes';
import * as actions from '../src/js/actions';
import {CALL_API} from '../src/js/middleware/api';

describe('core actions', () => {
  describe('global messages', () => {

    it('should create an action to add new global messages', () => {
      const action = actions.addGlobalMessage('success', 'my message');
      expect(action).to.eql({
        type: actionTypes.ADD_GLOBAL_MESSAGE,
        messageType: 'success',
        text: 'my message'
      });
    });

    it('should create an action to remove global messages', () => {
      const action = actions.removeGlobalMessage('success', 'my message');
      expect(action).to.eql({
        type: actionTypes.REMOVE_GLOBAL_MESSAGE,
        messageType: 'success',
        text: 'my message'
      });
    });

  });

  describe('logging in', () => {

    it('should create action for starting login process', () => {
      const action = actions.login();
      expect(action).to.eql({
        type: actionTypes.LOGIN
      });
    });

    it('should create action for a failed login process', () => {
      const action = actions.loginFailure();
      expect(action).to.eql({
        type: actionTypes.LOGIN_FAILURE
      });
    });

    it('should create a successfully-logged-in action', () => {
      const action = actions.loginSuccessful({
        key: 'value'
      });
      expect(action).to.eql({
        type: actionTypes.LOGIN_SUCCESSFUL,
        authData: {
          key: 'value'
        }
      });
    });

  });

  describe('signing up', () => {

    it('creates an action that indicates the user is signing up', () => {
      const action = actions.signupRequest();
      expect(action).to.eql({
        type: actionTypes.SIGNUP_REQUEST
      });
    });

    it('creates an action that finishes the signup process', () => {
      const action = actions.signupCompleted();
      expect(action).to.eql({
        type: actionTypes.SIGNUP_COMPLETED
      });
    });

    it('creates an action that indicates a failed signup', () => {
      const action = actions.signupFailure();
      expect(action).to.eql({
        type: actionTypes.SIGNUP_FAILURE
      });
    });

  });

  describe('fetching data', () => {

    it('returns action for fetching extended app data', () => {
      const action = actions.fetchAppExtendedEntity('userid', 'appid');
      expect(action).to.eql({
        [CALL_API]: {
          types: ['APP_EXTENDED_REQUEST', 'APP_EXTENDED_SUCCESS', 'APP_EXTENDED_FAILURE'],
          endpoint: `users/userid/appsExtended/appid`,
          entityOrCollection: 'entity',
          id: 'appid',
          name: 'appsExtended'
        }
      });
    });

  });
});