import React from 'react';
import Pure from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {Link} from 'react-router';

import AppList from '../components/AppList';
import {loadAppCollection} from '../actions/thunks';
import {loadAppEntity, loadThumbEntity} from '../actions/thunks';
import {fetchAppCollection} from '../actions';

const allowedStatuses = [
  'approved', 'denied', 'pending'
];

export const AppListEntry = React.createClass({
  mixins: [Pure],

  render: function() {
    return (
      <div>
        <p><Link to="/submit">Submit New App</Link></p>
        <AppList {...this.props} />
      </div>
    );
  }
});

function mapStateToProps(state, ownProps) {
  let status = ownProps.params.status;

  if (!status || allowedStatuses.indexOf(status) < 0) {
    status = 'approved';
  }

  return {
    appCollection: state.getIn(['collections', `${status}Apps`]),
    apps: state.getIn(['entities', 'apps']),
    thumbs: state.getIn(['entities', 'thumbs']),
    status: status
  };
}

function mapActionsToProps(dispatch) {
  return {
    loadAppCollection: (...args) => dispatch(loadAppCollection(...args)),
    fetchAppCollection: (...args) => dispatch(fetchAppCollection(...args)),
    loadAppEntity: (...args) => dispatch(loadAppEntity(...args)),
    loadThumbEntity: (...args) => dispatch(loadThumbEntity(...args))
  }
}

export const AppListEntryContainer = connect(mapStateToProps, mapActionsToProps)(AppListEntry);