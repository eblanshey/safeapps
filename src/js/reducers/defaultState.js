import {fromJS} from 'immutable';

export default fromJS({
  messages: {
    success: [],
    error: []
  },
  entities: {},
  collections: {},
  auth: {
    isLoggedIn: false,
    isLoggingIn: false,
    authData: null,
    isAdmin: false
  },
  signup: {
    isSigningUp: false,
    didCreateLogin: false
  }
});