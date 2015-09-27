import React from 'react/addons';
import {fromJS} from 'immutable';
import {connect} from 'react-redux';

import {submitEmailLogin, signup} from '../actions/thunks';
import {addGlobalMessage} from '../actions';

export const Login = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentWillMount: function() {
    transitionIfNeeded.call(this, this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    transitionIfNeeded.call(this, nextProps);
  },

  logIn(e) {
    const email = React.findDOMNode(this.refs.email).value;
    const password = React.findDOMNode(this.refs.password).value;
    
    if (!email || !password) {
      this.props.addGlobalMessage('error', 'You need to enter an email and password.');
      return;
    }

    this.props.login(email, password);
  },

  signUp(e) {
    const email = React.findDOMNode(this.refs.email).value;
    const password = React.findDOMNode(this.refs.password).value;

    if (!email || !password) {
      this.props.addGlobalMessage('error', 'You need to enter an email and password.');
      return;
    }

    this.props.signup(email, password);
  },

  render: function() {
    const disabled = this.props.isLoggingIn || this.props.isSigningUp;

    return (
      <div className="Login">
        <div><input ref="email" type="text" placeholder="Email" /></div>
        <div><input ref="password" type="password" placeholder="Password" /></div>
        <div><button disabled={disabled} ref="loginButton" onClick={this.logIn}>Log In</button></div>
        <div><button disabled={disabled} ref="signupButton" onClick={this.signUp}>Sign Up</button></div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  return {
    isSigningUp: state.getIn(['signup', 'isSigningUp']),
    isLoggingIn: state.getIn(['auth', 'isLoggingIn']),
    isLoggedIn: state.getIn(['auth', 'isLoggedIn'])
  };
}

function mapActionsToProps(dispatch) {
  return {
    login: (...args) => dispatch(submitEmailLogin(...args)),
    signup: (...args) => dispatch(signup(...args)),
    addGlobalMessage: (...args) => dispatch(addGlobalMessage(...args))
  }
}

export const LoginContainer = connect(mapStateToProps, mapActionsToProps)(Login);

function transitionIfNeeded(props) {
  if(props.isLoggedIn) {
    props.history.pushState(null, '/');
  }
}