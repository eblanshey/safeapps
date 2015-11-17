import React from 'react/addons';

export default React.createClass({
  //mixins: [React.addons.PureRenderMixin],

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
    const {app, id} = this.props;
    let content;

    if (!app || app.size === 0 || app.get('isLoading') === true) {
      content = <h3>Loading app #{id}</h3>;
    } else {
      const appData = app.get('data');

      content = (
        <div>
          <h2>{appData.get('humanName')}</h2>

          <h3>{appData.get('caption')}</h3>
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