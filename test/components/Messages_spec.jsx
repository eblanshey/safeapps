import React from 'react/addons';
import {expect} from 'chai';
import {fromJS} from 'immutable';

import {GlobalMessages} from '../../src/js/components/GlobalMessages';

const {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate
  } = React.addons.TestUtils;

describe('GlobalMessages component', () => {

  const messages = fromJS({
    success: [{
      text: 'success!'
    }],
    error: [{
      text: 'error :('
    }]
  });

  it('renders error and success messages', () => {
    const component = renderIntoDocument(
      <GlobalMessages messages={messages} />
    );
    const success = scryRenderedDOMComponentsWithClass(component, 'successMessage');
    const error = scryRenderedDOMComponentsWithClass(component, 'errorMessage');
    expect(success[0].getDOMNode().textContent).to.contain('success!');
    expect(error[0].getDOMNode().textContent).to.contain('error :(');
  });

  it('invokes callback when a Close button is clicked', () => {
    let closed = false;
    const close = () => closed = true;

    const component = renderIntoDocument(
      <GlobalMessages messages={messages} close={close} />
    );
    const closeLinks = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(closeLinks[0]);

    expect(closed).to.equal.false;
  });

});