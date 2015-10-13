import {fromJS, Map} from 'immutable';
import sinon from 'sinon';
import * as Firebase from '../src/js/firebaseRepository';
import {restore} from './test_utils';
import {createStore, applyMiddleware} from 'redux';
import {expect} from 'chai';

import apiMiddleware from '../src/js/middleware/api';
import {fetchActiveAppCollection} from '../src/js/actions';
import reducer from '../src/js/reducers';
import * as coreReducers from '../src/js/reducers/core';

describe('api middleware', () => {

  function initializeStore(initialState) {
    // Prepare store
    const createStoreWithMiddleware = applyMiddleware(
      apiMiddleware
    )(createStore);
    return createStoreWithMiddleware(reducer, initialState);
  }

  it('successfully calls the endpoint to fetch the active app collection', (done) => {
    const store = initializeStore(fromJS({collections: {}}));

    const returnValue = {testKey: 'testValue'};
    sinon
      .stub(Firebase, 'getOnce')
      .resolves(returnValue);

    const setCollectionRequest = sinon
      .spy(coreReducers, 'setCollectionRequest');
    const setCollectionSuccess = sinon
      .spy(coreReducers, 'setCollectionSuccess');

    try {
      const result = store.dispatch(fetchActiveAppCollection());
      result.then((data) => {
          const shouldBe = fromJS({
            isLoading: false,
            data: {
              testKey: 'testValue'
            }
          });
          expect(store.getState().getIn(['collections', 'approvedApps'])).to.equal(shouldBe);
          expect(setCollectionRequest.withArgs(Map({
            isLoading: false,
            data: null
          })).calledOnce).to.be.true;
          expect(setCollectionSuccess.calledOnce).to.be.true;
          restore(Firebase.getOnce);
          done();
        },
        (error) => {
          done(error);
        });
    } catch (x) {
      done(x);
    }

  });

});