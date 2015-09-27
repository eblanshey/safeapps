import React from 'react';
import {fromJS} from 'immutable';

import {GlobalMessagesContainer} from '../components/GlobalMessages';

export default React.createClass({
  mixins: [React.addons.PureRenderMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  render: function() {
    return (
      <div>
        <GlobalMessagesContainer />
        {this.props.children}
      </div>
    );
  }
});

