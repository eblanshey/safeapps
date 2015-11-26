import React from 'react';
import DOM from 'react-dom';
import Router, {Route, IndexRoute} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import loggerMiddleware from './middleware/logger';
import apiMiddleware from './middleware/api';
import {Provider} from 'react-redux';

import App from './views/App';
import {AppListEntryContainer} from './views/AppListEntry';
import {AppEntryContainer} from './views/AppEntry';
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
  store.dispatch(loginSuccessful(authData));
});

const routes = (
  <Route path="/" component={App}>
    <Route path="login" component={LoginContainer} />
    <Route path=":status" component={AppListEntryContainer} />
    <Route path="app/:userid/:appid" component={AppEntryContainer} />
    <IndexRoute component={AppListEntryContainer} />
  </Route>
);

DOM.render(
  <Provider store={store}>
    <Router>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
);

