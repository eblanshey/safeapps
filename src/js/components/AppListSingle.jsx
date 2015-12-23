import React from 'react';
import Pure from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import Thumb from './Thumb';

export default React.createClass({
  mixins: [Pure],

  propTypes: {
    userid: React.PropTypes.string.isRequired,
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
      ]).isRequired,
    loadAppEntity: React.PropTypes.func.isRequired,
    app: React.PropTypes.object
  },

  componentWillMount() {
    const {loadAppEntity, userid, id} = this.props;

    loadAppEntity(userid, id);
  },

  render: function() {
    const {app, id, thumb, userid} = this.props;
    let content;

    if (!app || app.size === 0 || app.get('isLoading') === true) {
      content = <h3>Loading app #{id}</h3>;
    } else {
      const appData = app.get('data'),
        thumbContent = appData.get('thumbid') ? (<Thumb
          userid={userid}
          thumbid={appData.get('thumbid')}
          thumb={thumb}
          size={50}
          loadThumbEntity={this.props.loadThumbEntity}
          />) : null;

      console.log('the humb data', app.get('thumbid'));

      content = (
        <div>
          {thumbContent}

          <h2><Link to={`/app/${userid}/${id}`}>{appData.get('humanName')}</Link></h2>

          <h3>{appData.get('caption')}</h3>
        </div>
      );
    }

    return (
      <div className="AppListSingle">{content}</div>
    )
  }
});
