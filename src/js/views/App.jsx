import React from 'react';
import Pure from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';

import {GlobalMessagesContainer} from '../components/GlobalMessages';

export default React.createClass({
  mixins: [Pure],

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

