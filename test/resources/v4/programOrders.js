'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    _         = require('underscore'),
    nock      = require('nock'),
    RO        = require('../../..'),
    fixtures  = require('../../fixtures/v4/programOrdersFixtures');

describe('v4 RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    RO.config.set('apiVersion', 'v4');
  });

  beforeEach(function() {
    fixtures();
  });

  afterEach(function() {
    nock.cleanAll();
  });

  after(function() {
    RO.config.reset();
  });

  describe('orders', function() {
    var id = 33,
        program = RO.program(id);

    before(function() {
      RO.config.set('clientId', 'programTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    after(function() {
      RO.config.reset();
    });

    it('should have the correct context ID', function() {
      assert.equal(program.orders.contextId, id);
    });

    it('should have the correct context', function() {
      assert.equal(program.orders.contextTypeName, 'programs');
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234rewardTime'
            }
          })
          .get('/programs/33/orders', {
            member_id: 38
          })
          .reply(200, {
            result: []
          });

        program.orders.getAll(38, function(error, data) {
          assert.typeOf(data, 'array');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
        .get('/programs/12/orders', {
            member_id: 3
          })
          .reply(200, {
            result: []
          });

        RO.program(12).orders.getAll(3, function(error, orderList) {
          assert.equal(error, null);

          assert.typeOf(orderList, 'array');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
        var body = {
              page: 7,
              per_page_count: 50
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
            .get('/programs/55/orders', _.extend(body, {
              member_id: 777
            }))
            .reply(200, {
              result: []
            });

        RO.program(55).orders.getAll(777, body, function(error, programsList) {
          assert.equal(error, null);

          assert.typeOf(programsList, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });

    describe('get()', function() {
      it('should pass an object to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .get('/programs/33/orders/555')
          .once()
          .reply(200, {
            result: {}
          });

        program.orders.get(555, function(error, data) {
          assert.typeOf(data, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
              .get('/programs/12/orders/929')
              .once()
              .reply(200, {
                result: {}
              });

        RO.program(12).orders.get(929, function(error, orderList) {
          assert.equal(error, null);

          assert.typeOf(orderList, 'object');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });
    });

    describe('create()', function() {
      it('should fire the callback with an error when the options object is missing a member object', function(done) {
        var options = {
              items: [{}]
            },
            scope = nock(RO.urls.apiBaseUrl())
              .post('/programs/33/orders', options)
              .reply(200);

        program.orders.create(options, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass a member object in the options object to `orders.create()`');

          assert.equal(data, undefined);

          assert.equal(scope.isDone(), false, 'no API call was made');

          done();
        });
      });

      it('should fire the callback with an error when the options object is missing an items array', function(done) {
        var options = {
              member: {id: 'hoo_ah'}
            },
            scope = nock(RO.urls.apiBaseUrl())
              .post('/programs/33/orders', options)
              .reply(200);

        program.orders.create(options, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass an items array in the options object to `orders.create()`');

          assert.equal(data, undefined);

          assert.equal(scope.isDone(), false, 'no API call was made');

          done();
        });
      });

      it('should pass an object to the callback', function(done) {
        var newOrder = {
              member: {
                'id': 'abc123ppp'
              },
              items: [{}]
            };

        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .post('/programs/33/orders', newOrder)
          .reply(200, {
            result: {}
          });

        program.orders.create(newOrder, function(error, result) {
          assert.equal(error, null);
          assert.typeOf(result, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var newOrder = {
              member: {
                'id': 'ab098765',
                'full_name': 'Prit Kaur',
                'email': 'prit@hotmail.co.uk',
                'phone': '123-456-7890',
                'address': {
                  'address': '123 Some Town',
                  'city': 'Sheffield',
                  'country_code': 'UK',
                  'postal_code': 'S32 5N9'
                }
              },
              items: [{
                'item_order_token': '3o2u4902u3joo4',
                'quantity': 2,
                'member_spend': [
                  {
                    'currency_code': 'XRO-ABC',
                    'amount': '1000'
                  }
                ],
                'retail_value': {
                  'currency_code': 'USD',
                  'amount': '20'
                }
              }]
            },
            apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
              .post('/programs/33/orders', newOrder)
              .reply(200, {
                result: {status: 'OK'}
              });

        RO.program(33).orders.create(newOrder, function(error, result) {
          assert.equal(error, null);

          assert.deepEqual(result, { status: 'OK' });
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should pass an error to the callback when a body isn\'t passed', function(done) {
        var scope = nock(RO.urls.apiBaseUrl(), {
          reqHeaders: {
            'Authorization': 'Bearer abcd1234rewardTime'
          }
        })
          .post('/programs/133000/orders')
          .reply(200, {
            result: {}
          });

        RO.program(133000).orders.create(function(error, result) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'A body object is required');

          assert.equal(result, undefined);

          assert.equal(scope.isDone(), false, 'no API call was made');

          done();
        });
      });
    });
  });
});

