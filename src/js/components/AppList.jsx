import React from 'react/addons';
import {Map} from 'immutable';

const AppList = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    status: React.PropTypes.string.isRequired,
    appCollection: React.PropTypes.object.isRequired,
    apps: React.PropTypes.object.isRequired,
    loadAppCollection: React.PropTypes.func.isRequired,
    fetchAppCollection: React.PropTypes.func.isRequired,
    loadAppEntity: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    loadApps.call(this, this.props);
  },

  componentWillReceiveProps(nextProps) {
    loadApps.call(this, nextProps);

    // Load each app
    var appCollectionData = nextProps.appCollection.get('data');

    appCollectionData.forEach((app, id) => {
      nextProps.loadAppEntity(app.userid, id);
    });
  },

  forceLoadAppCollection() {
    fetchApps.apply(this);
  },

  render: function() {
    const { apps, appCollection } = this.props;

    if (appCollection.size === 0 || appCollection.isLoading) {
      console.log('displayed LOADING');
      return <h1>Loading apps...</h1>
    }

    return (<div>{appCollection.get('data').map((unused, id) => {
      let app = apps.get(id);

      if (!app) {
        return <h3>Loading app #{id}</h3>
      }

      return (
        <div>
          <h2>{app.humanName}</h2>
          <h3>{app.caption}</h3>
        </div>
      );
    })}</div>);
  }
});

export default AppList;

function loadApps(props) {
   return props.loadAppCollection();
}

function fetchApps() {
  return this.props.fetchAppCollection();
}
