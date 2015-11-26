import React from 'react/addons';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import Thumb from '../components/Thumb';
import {loadAppEntity, loadAppExtendedEntity, loadThumbEntity} from '../actions/thunks';

export const AppEntry = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  attemptedToLoadThumb: {},

  propTypes: {
    app: React.PropTypes.object,
    appExtended: React.PropTypes.object,
    thumb: React.PropTypes.object,
    loadAppEntity: React.PropTypes.func.isRequired,
    loadAppExtendedEntity: React.PropTypes.func.isRequired,
    loadThumbEntity: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    loadData.call(this);
  },

  componentWillReceiveProps(props) {
    loadData.call(this);
  },

  render: function() {
    const {app, appExtended, thumb} = this.props,
      {userid} = this.props.params;
    let appContent = null, appExtendedContent = null;

    if (!app || app.get('isLoading')) {
      appContent = (<div>Loading...</div>);
    } else if (app.get('data')) {
      appContent = (
        <div>
          <Thumb
            userid={userid}
            thumbid={app.getIn(['data', 'thumbid'])}
            thumb={thumb}
            size={50}
            loadThumbEntity={this.props.loadThumbEntity}
            />
          <h2>{app.get('data').get('humanName')}</h2>

          <h3>{app.get('data').get('caption')}</h3>
        </div>
      )
    } else {
      // App doesn't exist -- it's not loading, so there was no app here.
      appContent = <div>This app does not exist.</div>;
    }

    if (!appExtended || appExtended.get('isLoading')) {
      appExtendedContent = (<div>Loading...</div>);
    } else if (appExtended.get('data')) {
      appExtendedContent = (
        <div>
          <p>{appExtended.get('data').get('description')}</p>
        </div>
      )
    } else {
      appExtendedContent = null;
    }

    return (
      <div>
        {appContent}
        {appExtendedContent}
      </div>);
  }
});

function getThumbid(app) {
  return app ?
    app.getIn(['data', 'thumbid']) :
    null;
}

function loadData() {
  let {userid, appid} = this.props.params;

  this.props.loadAppEntity(userid, appid);
  this.props.loadAppExtendedEntity(userid, appid, true);
}

function mapStateToProps(state, componentProps) {
  const {appid} = componentProps.params,
    app = state.getIn(['entities', 'apps', appid]);

  let thumb,
    thumbid = getThumbid(app);

  if (thumbid) {
    thumb = state.getIn(['entities', 'thumbs', thumbid]);
  }

  return {
    app: state.getIn(['entities', 'apps', appid]),
    appExtended: state.getIn(['entities', 'appsExtended', appid]),
    thumb
  };
}

function mapActionsToProps(dispatch) {
  return {
    loadAppEntity: (...args) => dispatch(loadAppEntity(...args)),
    loadAppExtendedEntity: (...args) => dispatch(loadAppExtendedEntity(...args)),
    loadThumbEntity: (...args) => dispatch(loadThumbEntity(...args))
  }
}

export const AppEntryContainer = connect(mapStateToProps, mapActionsToProps)(AppEntry);