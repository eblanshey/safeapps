import React from 'react/addons';
import {expect} from 'chai';
import {Map, fromJS} from 'immutable';

import {Login} from '../../src/js/views/Login';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag, Simulate} = React.addons.TestUtils;

describe('Login view', () => {

  it('renders email/password text boxes, and login and signup buttons', () => {
    const component = renderIntoDocument(
      <Login />
    );
    const textBoxes = scryRenderedDOMComponentsWithTag(component, 'input');
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(textBoxes.length).to.equal(2);
    expect(submit.length).to.equal(2);
    expect(submit[0].hasAttribute('disabled')).to.be.false;
  });

  it('renders email/password text boxes as disabled if isLoggingIn', () => {
    const component = renderIntoDocument(
      <Login isLoggingIn={true} />
    );
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(submit[0].hasAttribute('disabled')).to.be.true;
    expect(submit[1].hasAttribute('disabled')).to.be.true;
  });

  it('renders email/password text boxes as disabled if isSigningUp', () => {
    const component = renderIntoDocument(
      <Login isSigningUp={true} />
    );
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');

    expect(submit[0].hasAttribute('disabled')).to.be.true;
    expect(submit[1].hasAttribute('disabled')).to.be.true;
  });

  it('runs callback with a new error message if validation of login does\'t pass', (done) => {
    function addGlobalMessage(type, message) {
      expect(type).to.equal('error');
      expect(message).to.be.a.string;
      // Just using done() to make sure this callback is called
      done();
    }

    const component = renderIntoDocument(
      <Login addGlobalMessage={addGlobalMessage} />
    );

    const textBoxes = scryRenderedDOMComponentsWithTag(component, 'input');
    textBoxes[0].value = 'test@email.com';
    Simulate.change(textBoxes[0]);
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(submit[0]);
  });

  it('runs provided login callback with the correct email/pass combination', (done) => {
    function login(email, password) {
      expect(email).to.equal('test@email.com');
      expect(password).to.equal('mypass');
      // Just using done() to make sure this callback is called
      done();
    }

    const component = renderIntoDocument(
      <Login login={login} />
    );

    const textBoxes = scryRenderedDOMComponentsWithTag(component, 'input');
    const email = textBoxes[0];
    const pass = textBoxes[1];
    email.value = 'test@email.com';
    pass.value = 'mypass';
    Simulate.change(email);
    Simulate.change(pass);
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(submit[0]);
  });

  it('runs provided signup callback with the correct email/pass combination', (done) => {
    function signup(email, password) {
      expect(email).to.equal('test@email.com');
      expect(password).to.equal('mypass');
      // Just using done() to make sure this callback is called
      done();
    }

    const component = renderIntoDocument(
      <Login signup={signup} />
    );

    const textBoxes = scryRenderedDOMComponentsWithTag(component, 'input');
    const email = textBoxes[0];
    const pass = textBoxes[1];
    email.value = 'test@email.com';
    pass.value = 'mypass';
    Simulate.change(email);
    Simulate.change(pass);
    const submit = scryRenderedDOMComponentsWithTag(component, 'button');
    Simulate.click(submit[1]);
  });

});