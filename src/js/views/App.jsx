import React from 'react';
import {fromJS} from 'immutable';

import {GlobalMessagesContainer} from '../components/GlobalMessages';

export default React.createClass({
  render: function() {
    return (
      <div>
        <GlobalMessagesContainer />
        {this.props.children}
      </div>
    );
  }
});