import {fromJS, Map} from 'immutable';
import sinon from 'sinon';
import * as Firebase from '../src/js/firebaseRepository';
import {restore} from './test_utils';
import {createStore, applyMiddleware} from 'redux';
import {expect} from 'chai';

import apiMiddleware from '../src/js/middleware/api';
import {fetchApprovedAppCollection, fetchAppEntity} from '../src/js/actions';
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

  it('tests fetching collections from the api by fetching the active app collection', (done) => {
    const store = initializeStore(fromJS({collections: {}}));

    const returnValue = {testKey: 'testValue'};
    sinon
      .stub(Firebase, 'getOnce')
      .resolves(returnValue);

    const setCollectionRequest = sinon
      .spy(coreReducers, 'setCollectionRequest');
    const setCollectionSuccess = sinon
      .spy(coreReducers, 'setCollectionSuccess');

    const result = store.dispatch(fetchApprovedAppCollection());
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
          data: Map()
        })).calledOnce).to.be.true;
        expect(setCollectionSuccess.calledOnce).to.be.true;
        restore(Firebase.getOnce);
        done();
      },
      (error) => {
        done(error);
      }
    ).catch(done);

  });

  it('tests fetching entities from the api by fetching an app entity', (done) => {
    const store = initializeStore(fromJS({entities: {}}));

    const returnValue = {testKey: 'testValue'};
    sinon
      .stub(Firebase, 'getOnce')
      .resolves(returnValue);

    const setEntityRequest = sinon
      .spy(coreReducers, 'setEntityRequest');
    const setEntitySuccess = sinon
      .spy(coreReducers, 'setEntitySuccess');

    const result = store.dispatch(fetchAppEntity('userid', 'abc'));
    result.then(() => {
        const shouldBe = fromJS({
          apps: {
            abc: {
              isLoading: false,
              data: {
                testKey: 'testValue'
              }
            }
          }
        });
        expect(store.getState().get('entities')).to.equal(shouldBe);
        expect(setEntityRequest.withArgs(Map({
          isLoading: false,
          data: null
        })).calledOnce).to.be.true;
        expect(setEntitySuccess.calledOnce).to.be.true;
        restore(Firebase.getOnce);
        done();
      },
      (error) => {
        done(error);
      }
    );

  });

});