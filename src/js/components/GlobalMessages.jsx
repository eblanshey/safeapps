import React from 'react/addons';
import {connect} from 'react-redux';

import {removeGlobalMessage} from '../actions';

export const GlobalMessages = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  messages(type) {
    return this.props.messages.get(type, []);
  },

  render: function() {
    return <div className="Messages">
      <div className="successMessages">
        {this.messages('success').map((message, key) =>
          <div key={key} className="successMessage">Success: {message.get('text')}
            <button onClick={() => this.props.close('success', message.get('text'))}>Close</button>
          </div>
        )}
      </div>
      <div className="errorMessages">
        {this.messages('error').map((message, key) =>
            <div key={key} className="errorMessage">Error: {message.get('text')}
              <button onClick={() => this.props.close('error', message.get('text'))}>Close</button>
            </div>
        )}
      </div>
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    messages: state.get('messages')
  };
}

function mapActionsToProps(dispatch) {
  return {
    close: (...args) => dispatch(removeGlobalMessage(...args))
  }
}

export const GlobalMessagesContainer = connect(mapStateToProps, mapActionsToProps)(GlobalMessages);