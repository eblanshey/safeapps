import React from 'react/addons';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    userid: React.PropTypes.string.isRequired,
    thumbid: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    thumb: React.PropTypes.object,
    size: React.PropTypes.number,
    loadThumbEntity: React.PropTypes.func.isRequired
  },

  componentWillMount() {
    loadData.call(this, this.props);
  },

  componentWillReceiveProps(nextProps) {
    loadData.call(this, nextProps);
  },

  render() {
    const {thumb, size} = this.props;

    if (!thumb || thumb.get('isLoading')) {
      return (<div><p>...</p></div>)
    } else if (thumb && thumb.get('data')) {
      let style = {
        maxWidth: size,
        maxHeight: size
      };
      return (<div><img className="Thumb" src={thumb.get('data')} style={style} /></div>);
    } else {
      return null;
    }
  }

});

function loadData(props) {
  if (!props.thumb) {
    props.loadThumbEntity(props.userid, props.thumbid);
  }
}