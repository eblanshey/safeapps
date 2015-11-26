import React from 'react';
import ReactAddons from 'react-addons-test-utils';
import {expect} from 'chai';
import {Map, fromJS} from 'immutable';
import sinon from 'sinon';
import {restore} from '../test_utils';

import {AppEntry} from '../../src/js/views/AppEntry';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = ReactAddons;

describe('App entry view', () => {

  let defaultProps = {
    params: {
      appid: '123',
      userid: 'userid'
    },
    app: null,
    appExtended: null,
    thumb: null,
    loadAppEntity: function() {},
    loadAppExtendedEntity: function() {},
    loadThumbEntity: function() {}
  };

  it('shows the loading divs if no apps are provided.', () => {
    const loadAppEntity = sinon
      .spy(defaultProps, 'loadAppEntity');
    const loadAppExtendedEntity = sinon
      .spy(defaultProps, 'loadAppExtendedEntity');
    const loadThumbEntity = sinon
      .spy(defaultProps, 'loadThumbEntity');

    const component = renderIntoDocument(
      <AppEntry {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(loadAppEntity.calledOnce).to.be.true;
    expect(loadAppExtendedEntity.calledOnce).to.be.true;
    expect(loadThumbEntity.notCalled).to.be.true;
    expect(divs.length).to.equal(3);
    expect(divs[1].textContent).to.contain('Loading');
    expect(divs[2].textContent).to.contain('Loading');
    restore(loadAppEntity, loadAppExtendedEntity, loadThumbEntity);
  });

  it('shows the loading div for app if is loading.', () => {
    defaultProps.app = Map({isLoading: true, data: null});

    const component = renderIntoDocument(
      <AppEntry {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs.length).to.equal(3);
    expect(divs[1].textContent).to.contain('Loading');
  });

  it('shows the app without thumb', () => {
    defaultProps.app = Map({isLoading: false, data: Map({
      humanName: 'My App',
      caption: 'My caption',
      thumbid: 'mythumb'
    })});

    const loadThumbEntity = sinon
      .spy(defaultProps, 'loadThumbEntity');

    const component = renderIntoDocument(
      <AppEntry {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(loadThumbEntity.calledOnce).to.be.true;
    expect(divs[0].textContent).to.contain('My App');
    expect(divs[0].textContent).to.contain('My caption');
    restore(loadThumbEntity);
  });

  it('shows the extended content', () => {
    defaultProps.appExtended = Map({isLoading: false, data: Map({
      description: 'my description is present'
    })});

    const component = renderIntoDocument(
      <AppEntry {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs[0].textContent).to.contain('my description is present');
  });



});