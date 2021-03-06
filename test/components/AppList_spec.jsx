import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import {fromJS, Map} from 'immutable';

import AppList from '../../src/js/components/AppList';
import AppListSingle from '../../src/js/components/AppListSingle';

const {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  scryRenderedDOMComponentsWithTag,
  Simulate,
  mockComponent
  } = TestUtils;

const defaultAppListProps = {
  fetchAppCollection: function() {},
  loadAppEntity: function() {},
  loadAppCollection: function() {},
  appCollection: null,
  apps: null
};

describe('AppList component', () => {

  it('shows loading message when the app collection is not yet loaded', () => {
    const component = renderIntoDocument(
      <AppList {...defaultAppListProps} />
    );
    const message = scryRenderedDOMComponentsWithClass(component, 'loadingApps');
    expect(message[0].textContent).to.contain('Loading');
  });

  it('shows loading message when the app collection is loading', () => {
    const component = renderIntoDocument(
      <AppList {...defaultAppListProps} appCollection={Map({isLoading: true})} />
    );
    const message = scryRenderedDOMComponentsWithClass(component, 'loadingApps');
    expect(message[0].textContent).to.contain('Loading');
  });

  it('loads an AppListSingle component when an app is available', () => {
    let collection = Map({
      isLoading: false,
      data: Map({
        myappid: Map({
          userid: 'id',
          approved: Date.now()
        })
      })
    });

    const component = renderIntoDocument(
      <AppList {...defaultAppListProps} appCollection={collection} />
    );

    const rendered = scryRenderedDOMComponentsWithClass(component, 'AppListSingle');
    expect(rendered[0]).to.be.ok;
  });

});