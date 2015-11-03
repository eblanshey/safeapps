import React from 'react/addons';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    userid: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    loadAppEntity: React.PropTypes.func.isRequired,
    app: React.PropTypes.object
  },

  componentWillMount() {
    const {loadAppEntity, userid, id} = this.props;

    loadAppEntity(userid, id);
  },

  render: function() {
    const {app, id} = this.props;
    let content;

    if (!app) {
      content = <h3>Loading app #{id}</h3>;
    } else {
      content = (
        <div>
          <h2>{app.humanName}</h2>

          <h3>{app.caption}</h3>
        </div>
      );
    }

    return (
      <div className="AppListSingle">{content}</div>
    )
  }
});

function loadAppEntity(userid, id) {
  return props.loadAppCollection();
}