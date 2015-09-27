import {expect} from 'chai';
import {fromJS} from 'immutable';
import sinon from 'sinon';
import {restore} from './test_utils';

import * as Firebase from '../src/js/firebaseRepository';
import * as thunks from '../src/js/actions/thunks';
import * as actions from '../src/js/actions';

describe('thunk actions', () => {

  function dispatch(arg) {
    return arg;
  }

  describe('login', () => {

    it('should return true when firebase returns authData', (done) => {

      const returnValue = {testKey: 'testValue'};
      sinon
        .stub(Firebase, 'loginWithEmail')
        .resolves(returnValue);

      const login = sinon
        .spy(actions, 'login');

      const authData = {
        auth: {
          authData: null
        }
      };

      function getState() {
        return fromJS(authData);
      }

      thunks
        .submitEmailLogin('email', 'password')(dispatch, getState)
        .then(result => {
          expect(login.withArgs().calledOnce).to.be.true;
          restore(Firebase.loginWithEmail, login);
          done();
        });
    });

    it('should "start login", then send out a "global error message" and "failed login" when firebase returns an error', (done) => {
      const returnValue = 'error message';
      sinon
        .stub(Firebase, 'loginWithEmail')
        .rejects(returnValue);

      const addGlobalMessage = sinon
        .spy(actions, 'addGlobalMessage');
      const login = sinon
        .spy(actions, 'login');
      const loginFailure = sinon
        .spy(actions, 'loginFailure');

      const authData = {
        auth: {
          authData: null
        }
      };

      function getState() {
        return fromJS(authData);
      }

      thunks
        .submitEmailLogin('email', 'password')(dispatch, getState)
        .then(result => {
          expect(addGlobalMessage.withArgs('error', sinon.match.any).calledOnce).to.be.true;
          expect(login.withArgs().calledOnce).to.be.true;
          expect(loginFailure.withArgs().calledOnce).to.be.true;
          restore(Firebase.loginWithEmail, login, loginFailure, addGlobalMessage);
          done();
        });
    });


  });

  describe('signup', () => {

    it('signs up successfully', () => {
      sinon
        .stub(Firebase, 'signupWithEmail')
        .resolves({testKey: 'testValue'}); // whatever it returns won't actually be used by our app

      const returnValue = {testKey: 'testValue'};
      sinon
        .stub(Firebase, 'loginWithEmail')
        .resolves(returnValue);

      const signupRequest = sinon
        .spy(actions, 'signupRequest');
      const signupCompleted = sinon
        .spy(actions, 'signupCompleted');
      const addGlobalMessage = sinon
        .spy(actions, 'addGlobalMessage');

      thunks
        .signup('test@email.com', 'asdf')(dispatch)
        .then(() => {
          expect(signupRequest.withArgs().calledOnce).to.be.true;
          expect(signupCompleted.withArgs().calledOnce).to.be.true;
          expect(addGlobalMessage.firstCall.calledWith('success', sinon.match.string)).to.be.true;
          expect(addGlobalMessage.withArgs('error', sinon.match.string).called).to.be.false;

          restore(Firebase.signupWithEmail, signupCompleted, signupRequest, addGlobalMessage);
          done();
        });

    });

    it('should send out a global error message and signupFailure action when firebase returns an error', (done) => {
      const returnValue = 'error message';
      sinon
        .stub(Firebase, 'signupWithEmail')
        .rejects(returnValue);

      const signupRequest = sinon
        .spy(actions, 'signupRequest');
      const signupFailure = sinon
        .spy(actions, 'signupFailure');
      const addGlobalMessage = sinon
        .spy(actions, 'addGlobalMessage');

      thunks
        .signup('test@email.com', 'asdf')(dispatch)
        .then(() => {
          expect(Firebase.loginWithEmail.calledOnce).to.be.true;
          expect(addGlobalMessage.withArgs('error', sinon.match.any).calledOnce).to.be.true;
          expect(signupRequest.withArgs().calledOnce).to.be.true;
          expect(signupFailure.withArgs().calledOnce).to.be.true;

          restore(Firebase.signupWithEmail, Firebase.loginWithEmail, signupRequest, addGlobalMessage, signupFailure);

          done();
        });
    });

  });

});