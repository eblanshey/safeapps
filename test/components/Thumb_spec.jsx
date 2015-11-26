import React from 'react';
import ReactAddons from 'react-addons-test-utils';
import {expect} from 'chai';
import {Map, fromJS} from 'immutable';
import sinon from 'sinon';
import {restore} from '../test_utils';

import Thumb from '../../src/js/components/Thumb';

const {renderIntoDocument, scryRenderedDOMComponentsWithTag} = ReactAddons;

describe('Thumb component', () => {

  let defaultProps = {
    userid: 'userid',
    thumbid: 'thumbid',
    thumb: null,
    size: 30,
    loadThumbEntity: function() {}
  };

  it('shows loading for thumb when thumb not present', () => {
    const component = renderIntoDocument(
      <Thumb {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs[0].textContent).to.contain('...');
  });

  it('shows loading for thumb when thumb is loading', () => {
    defaultProps.thumb = Map({data: null, isLoading: true});

    const component = renderIntoDocument(
      <Thumb {...defaultProps} />
    );
    const divs = scryRenderedDOMComponentsWithTag(component, 'div');

    expect(divs[0].textContent).to.contain('...');
  });

  it('shows thumb', () => {
    defaultProps.thumb = Map({isLoading: false, data: 'thumbsource'})
    const component = renderIntoDocument(
      <Thumb {...defaultProps} />
    );
    const img = scryRenderedDOMComponentsWithTag(component, 'img');

    expect(img[0].getAttribute('src')).to.eql('thumbsource');
  });



});