import {fromJS, Map} from 'immutable';
import sinon from 'sinon';
import * as Firebase from '../src/js/firebaseRepository';
import {restore} from './test_utils';
import {createStore, applyMiddleware} from 'redux';
import {expect} from 'chai';

import apiMiddleware from '../src/js/middleware/api';
import {fetchAppCollection, fetchAppEntity, putNewAppEntity} from '../src/js/actions';
import reducer from '../src/js/reducers';
import * as uuid from '../src/js/utils/uuid';
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
      .stub(Firebase, 'get')
      .resolves(returnValue);

    const setCollectionRequest = sinon
      .spy(coreReducers, 'setCollectionRequest');
    const setCollectionSuccess = sinon
      .spy(coreReducers, 'setCollectionSuccess');

    const result = store.dispatch(fetchAppCollection('approved'));
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
        restore(Firebase.get, setCollectionRequest, setCollectionSuccess);
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
      .stub(Firebase, 'get')
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
        restore(Firebase.get, setEntityRequest, setEntitySuccess);
        done();
      },
      (error) => {
        done(error);
      }
    ).catch(done);

  });

  it('tests putting a new app entity, then the collection item', (done) => {
    const store = initializeStore(fromJS({entities: {}, collections: {}}));

    sinon
      .stub(uuid, 'generateUUID')
      .returns('myuid');

    sinon.stub(Date, 'now').returns(7654321)

    sinon
      .stub(Firebase, 'set')
      .resolves();

    const setEntityRequest = sinon
      .spy(coreReducers, 'setEntityRequest');
    const setEntitySuccess = sinon
      .spy(coreReducers, 'setEntitySuccess');
    const setCollectionRequest = sinon
      .spy(coreReducers, 'setCollectionRequest');
    const setCollectionSuccess = sinon
      .spy(coreReducers, 'setCollectionSuccess');

    var data = {
      humanName: 'SAFE Talk',
      caption: 'The place to talk about everything SAFE', // max: 100 chars
      categories: [1, 2],
      thumbid: '123'
    };
    const result = store.dispatch(putNewAppEntity('userid', data));

    result.then(() => {
        let shouldBe = fromJS({
          apps: {
            myuid: {
              isLoading: false,
              data: data
            }
          }
        });
        expect(store.getState().get('entities')).to.equal(shouldBe);
        expect(setEntityRequest.withArgs(Map({
          isLoading: false,
          data: null
        })).calledOnce).to.be.true;
        expect(setEntitySuccess.calledOnce).to.be.true;

        shouldBe = fromJS({
          pendingApps: {
            isLoading: false,
            data: {
              'myuid': {
                userid: 'userid',
                submitted: 7654321
              }
            }
          }
        });
        expect(store.getState().get('collections')).to.equal(shouldBe);
        expect(setCollectionRequest.withArgs(Map({
          isLoading: false,
          data: null
        })).calledOnce).to.be.true;
        expect(setCollectionSuccess.calledOnce).to.be.true;

        restore(Firebase.set, setCollectionRequest, setCollectionSuccess, setEntityRequest, setEntitySuccess);
        done();
      },
      (error) => {
        done(error);
      }
    ).catch(done);

  });

});