import React from 'react/addons';
import {connect} from 'react-redux';
import {Map, List} from 'immutable';

import AppList from '../components/AppList';
import {loadApprovedAppCollection} from '../actions/thunks';
import {loadAppEntity, loadThumbEntity} from '../actions/thunks';
import {fetchApprovedAppCollection} from '../actions';

export const AppListEntry = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  allowedStatuses: [
    'approved', 'denied', 'pending'
  ],

  render: function() {
    let status = this.props.params.status;

    if (!status || this.allowedStatuses.indexOf(status) < 0) {
      status = 'approved';
    }

    return (
      <AppList status={status} {...this.props} />
    );
  }
});

function mapStateToProps(state) {
  return {
    appCollection: state.getIn(['collections', 'approvedApps'], Map()),
    apps: state.getIn(['entities', 'apps'], Map()),
    thumbs: state.getIn(['entities', 'thumbs'], Map())
  };
}

function mapActionsToProps(dispatch) {
  return {
    loadAppCollection: (...args) => dispatch(loadApprovedAppCollection(...args)),
    fetchAppCollection: (...args) => dispatch(fetchApprovedAppCollection(...args)),
    loadAppEntity: (...args) => dispatch(loadAppEntity(...args)),
    loadThumbEntity: (...args) => dispatch(loadThumbEntity(...args))
  }
}

export const AppListEntryContainer = connect(mapStateToProps, mapActionsToProps)(AppListEntry);