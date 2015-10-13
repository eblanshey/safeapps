import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import reducer from './coreReducers';
import thunk from 'redux-thunk';
import loggerMiddleware from './middleware/logger';
import apiMiddleware from './middleware/api';
import {Provider} from 'react-redux';

import App from './views/App';
import {LoginContainer} from './views/Login';
import {setupLoginListener} from './firebaseRepository';
import {loginSuccessful} from 'actions';

// Prepare store
const createStoreWithMiddleware = applyMiddleware(
  loggerMiddleware,
  apiMiddleware,
  thunk
)(createStore);
const store = createStoreWithMiddleware(reducer);

// Set up Firebase to dispatch authData on login (needed for auto-login when page reloaded)
setupLoginListener(authData => {
  console.log('got authdata', authData);
  store.dispatch(loginSuccessful(authData));
});

const routes = (
  <Route path="/" component={App}>
    <Route path="/login" component={LoginContainer} />
  </Route>
);

React.render(
  <Provider store={store}>
    {() =>
      <Router>
        {routes}
      </Router>
    }
  </Provider>,
  document.getElementById('app')
);

