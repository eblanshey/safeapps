import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

import App from './views/App';
import {LoginContainer} from './views/Login';

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);

const store = createStoreWithMiddleware(reducer);

const routes = (
  <Route component={App}>
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

