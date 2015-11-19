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
    size: React.PropTypes.number
  },

  componentWillMount() {
    if (!this.props.thumb) {
      this.props.loadThumbEntity(this.props.userid, this.props.thumbid);
    }
  },

  render() {
    const {thumb, size} = this.props;

    if (!thumb || thumb.get('isLoading') === true) {
      return (<div><p>Loading image...</p></div>)
    } else {
      return (<div><img src={thumb.get('data')} width={size} height={size} /></div>)
    }
  }

});
