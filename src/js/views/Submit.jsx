import React from 'react';
import DOM from 'react-dom';
import Pure from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';
import {connect} from 'react-redux';

import {putNewAppEntity} from '../actions';

export const Submit = React.createClass({
  mixins: [Pure],

  componentWillMount: function() {
    transitionIfNeeded.call(this, this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    transitionIfNeeded.call(this, nextProps);
  },

  onClick() {
    const humanName = DOM.findDOMNode(this.refs.humanName).value,
      caption = DOM.findDOMNode(this.refs.caption).value;

    if (!humanName || !caption) return;

    this.props.putNewAppEntity(this.props.userid, {humanName, caption});

    this.props.history.pushState(null, '/pending');
  },

  render() {
    return (
      <div>
        <p>
          <input type="text" ref="humanName" placeholder="App Name" />
        </p>
        <p>
          <input type="text" ref="caption" placeholder="Caption" />
        </p>
        <p>
          <button onClick={this.onClick}>Submit</button>
        </p>
      </div>
    );
  }
});


function mapStateToProps(state) {
  return {
    isLoggedIn: state.getIn(['auth', 'isLoggedIn']),
    userid: state.getIn(['auth', 'authData', 'auth', 'uid'])
  };
}

function mapActionsToProps(dispatch) {
  return {
    putNewAppEntity: (...args) => dispatch(putNewAppEntity(...args))
  }
}

export const SubmitContainer = connect(mapStateToProps, mapActionsToProps)(Submit);

function transitionIfNeeded(props) {
  if(!props.isLoggedIn) {
    props.history.pushState(null, '/login');
  }
}