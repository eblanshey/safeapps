import React from 'react/addons';
import {Map} from 'immutable';

import AppListSingle from './AppListSingle';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    appCollection: React.PropTypes.object,
    apps: React.PropTypes.object,
    loadAppCollection: React.PropTypes.func.isRequired,
    fetchAppCollection: React.PropTypes.func.isRequired,
    loadAppEntity: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    loadApps.call(this, this.props);
  },

  componentWillReceiveProps(nextProps) {
    loadApps.call(this, nextProps);
  },

  forceLoadAppCollection() {
    fetchApps.apply(this);
  },

  render: function() {
    const { apps, appCollection, thumbs } = this.props;
    let content

    // Show loading message if appCollection is not yet defined or it's loading
    try {
      if (!appCollection || appCollection.get('isLoading') === true) {
        content = (<h1 className="loadingApps">Loading apps...</h1>);
      } else {
        content = [];

        appCollection.get('data').forEach((collectionItem, id) => {
          const userid = collectionItem ? collectionItem.get('userid') : null;
          const app = apps ? apps.get(id) : null;

          const thumb = app && thumbs ? thumbs.get(app.getIn(['data', 'thumbid'])) : null;

          if (id && userid) {
            content.push(<AppListSingle
              loadAppEntity={this.props.loadAppEntity}
              loadThumbEntity={this.props.loadThumbEntity}
              userid={userid}
              id={id}
              key={id}
              app={app}
              thumb={thumb}
              />);
          }
        });
      }
    } catch(err) {
      console.log('Caught error', err);
    }

    return (<div className="AppList">{content}</div>);
  }
});

function loadApps(props) {
   return props.loadAppCollection();
}

function fetchApps() {
  return this.props.fetchAppCollection();
}
