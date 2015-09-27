import {expect} from 'chai';
import {fromJS, Map, List} from 'immutable';

import {setAuthData, loggingIn, loginFailure, signupRequest, signUp, signupSuccess, signupFailure,
  addGlobalMessage, removeGlobalMessage} from '../src/js/reducers/core';

describe('reducers', () => {

  describe('logging in', () => {

    it('sets authData on login given an object, emulating a login', () => {
      const state = fromJS({
        loggingIn: true,
        loggedIn: false,
        authData: null
      });
      const nextState = setAuthData(state, {
        key: 'value'
      });

      expect(nextState).to.equal(Map({
        loggingIn: false,
        loggedIn: true,
        authData: Map({
          key: 'value'
        })
      }));
    });

    it('sets logging in to true', () => {
      const state = fromJS({
        loggingIn: false,
        loggedIn: false,
        authData: null
      });
      const nextState = loggingIn(state);

      expect(nextState).to.equal(Map({
        loggingIn: true,
        loggedIn: false,
        authData: null
      }));
    });

    it('sets logging in to false', () => {
      const state = fromJS({
        loggingIn: true,
        loggedIn: false,
        authData: null
      });
      const nextState = loginFailure(state);

      expect(nextState).to.equal(Map({
        loggingIn: false,
        loggedIn: false,
        authData: null
      }));
    });

  });

  describe('signing up', () => {

    it('sets isSigningUp to TRUE', () => {
      const state = fromJS({
        isSigningUp: false,
        didCreateLogin: false
      });
      const nextState = signupRequest(state);

      expect(nextState).to.equal(fromJS({
        isSigningUp: true,
        didCreateLogin: false
      }));
    });

    it('finishes the signup process', () => {
      const state = fromJS({
        isSigningUp: true,
        didCreateLogin: false
      });
      const nextState = signupSuccess(state);

      expect(nextState).to.equal(fromJS({
        isSigningUp: false,
        didCreateLogin: true
      }));
    });

    it('fails to sign up', () => {
      const state = fromJS({
        isSigningUp: true,
        didCreateLogin: false
      });
      const nextState = signupFailure(state);

      expect(nextState).to.equal(fromJS({
        isSigningUp: false,
        didCreateLogin: false
      }));
    });

  });

  describe('messages', () => {

    it('adds a new success message', () => {
      const messages = Map({
        success: List(),
        error: List()
      });
      const nextState = addGlobalMessage(messages, 'success', 'Yay!');

      expect(nextState).to.equal(Map({
        success: List([
          Map({
            text: 'Yay!'
          })
        ]),
        error: List()
      }));
    });

    it('adds a new error message', () => {
      const messages = Map({
        success: List(),
        error: List()
      });
      const nextState = addGlobalMessage(messages, 'error', 'boo!');

      expect(nextState).to.equal(Map({
        success: List(),
        error: List([Map({
          text: 'boo!'
        })])
      }));
    });

    it('doesn\'t add a new message of unknown type', () => {
      const messages = Map({
        success: List(),
        error: List()
      });
      const nextState = addGlobalMessage(messages, 'weird', 'boo!');

      expect(nextState).to.equal(Map({
        success: List(),
        error: List()
      }));
    });

    it('removes messages by type', () => {
      const messages = Map({
        success: List(),
        error: List([Map({
          text: 'boo!'
        })])
      });
      const nextState = removeGlobalMessage(messages, 'error', 'boo!');

      expect(nextState).to.equal(Map({
        success: List(),
        error: List()
      }));
    });

  });

});