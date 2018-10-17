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
    var programId        = 33,
        program          = RO.program(programId),
        programOrdersUrl = '/programs/' + programId + '/orders';

    before(function() {
      RO.config.set('clientId', 'programTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    after(function() {
      RO.config.reset();
    });

    it('should have the correct context ID', function() {
      assert.equal(program.orders.contextId, programId);
    });

    it('should have the correct context', function() {
      assert.equal(program.orders.contextTypeName, 'programs');
    });

    describe('getSummary()', function() {
      it('should fire the callback with an error when the params object is missing', function(done) {
        program.orders.getSummary(function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'A params object is required');

          assert.equal(data, undefined);

          done();
        });

      });

      it('should pass an object to the callback', function(done) {
        var params = { member_id: 38 };

        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .get('/programs/' + programId + '/orders/summary')
          .query(params)
          .once()
          .reply(200, {
            result: {}
          });

        program.orders.getSummary(params, function(error, data) {
          assert.typeOf(data, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var params = { member_id: 38 };
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
            .get('/programs/12/orders/summary')
            .query(params)
            .once()
            .reply(200, {
              result: {}
            });

        RO.program(12).orders.getSummary(params, function(error, orderList) {
          assert.equal(error, null);

          assert.typeOf(orderList, 'object');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234rewardTime'
            }
          })
          .get(programOrdersUrl)
          .query({
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
          .get('/programs/12/orders')
          .query({
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

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function(done) {
        var params = {
              page: 7,
              per_page_count: 50
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
            .get('/programs/55/orders')
            .query(_.extend(params, {
              member_id: 777
            }))
            .reply(200, {
              result: []
            });

        RO.program(55).orders.getAll(777, params, function(error, programsList) {
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
          .get('/programs/' + programId + '/orders/555')
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

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function(done) {
        var params = {
              use_program_order_code: false
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
            .get('/programs/12/orders/929')
            .query(params)
            .reply(200, {
              result: {}
            });

        RO.program(12).orders.get(929, params, function(error, data) {
          assert.equal(error, null);

          assert.typeOf(data, 'object');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });

    describe('create()', function() {
      it('should fire the callback with an error when the params object is missing a member object', function(done) {
        var params = {
          items: [{}]
        };

        program.orders.create(params, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass a member object in the params object to `orders.create()`');

          assert.equal(data, undefined);

          done();
        });
      });

      it('should fire the callback with an error when the params object is missing an items array', function(done) {
        var params = {
          member: {id: 'hoo_ah'}
        };

        program.orders.create(params, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass an items array in the params object to `orders.create()`');

          assert.equal(data, undefined);

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
          .post(programOrdersUrl, newOrder)
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
              .post(programOrdersUrl, newOrder)
              .reply(200, {
                result: {status: 'OK'}
              });

        RO.program(programId).orders.create(newOrder, function(error, result) {
          assert.equal(error, null);

          assert.deepEqual(result, { status: 'OK' });
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should pass an error to the callback when a params object isn\'t passed', function(done) {
        RO.program(133000).orders.create(function(error, result) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'A params object is required');

          assert.equal(result, undefined);

          done();
        });
      });
    });

    describe('update()', function() {
      var orderId        = 'abcd1234asdf0987',
          orderUpdateUrl = '/programs/' + programId + '/orders/' + orderId;

      it('should fire the callback with an error when no id is passed as the first argument', function(done) {
        var params = {
          payment_status: 'PAID',
          payment_status_notes: 'The user paid, and we thank them for it.'
        };

        program.orders.update(params, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass an order (external) ID as the first argument to `orders.update()`');

          assert.equal(data, undefined);

          done();
        });
      });

      it('should fire the callback with an error when no params object is passed', function(done) {
        program.orders.update(orderId, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'A params object is required');

          assert.equal(data, undefined);

          done();
        });
      });

      it('should pass an object to the callback', function(done) {
        var params = {
          payment_status: 'PAID',
          payment_status_notes: 'The user paid, and we thank them for it.'
        };

        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .patch(orderUpdateUrl, params)
          .reply(200, {
            result: {}
          });

        program.orders.update(orderId, params, function(error, result) {
          assert.equal(error, null);
          assert.typeOf(result, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var params = {
          payment_status: 'PAID',
          payment_status_notes: 'The user paid, and we thank them for it.'
        },
        apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234rewardTime'
            }
          })
          .patch(orderUpdateUrl, params)
          .reply(200, {
            result: {status: 'OK'}
          });

        RO.program(programId).orders.update(orderId, params, function(error, result) {
          assert.equal(error, null);

          assert.deepEqual(result, { status: 'OK' });
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });
    });

    describe('updateOrderItems()', function() {
      var orderId        = 'abcd1234asdf0987',
          updateOrderItemsUrl = '/programs/' + programId + '/orders/' + orderId + '/order_items';

      it('should fire the callback with an error when no id is passed as the first argument', function(done) {
        var params = {
          order_item_payment_status: 'PAID',
          status_notes: 'The user paid, and we thank them for it.'
        };

        program.orders.updateOrderItems(params, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass an order (external) ID as the first argument to `orders.updateOrderItems()`');

          assert.equal(data, undefined);

          done();
        });
      });

      it('should fire the callback with an error when no params object is passed', function(done) {
        program.orders.updateOrderItems(orderId, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'A params object is required');

          assert.equal(data, undefined);

          done();
        });
      });

      it('should pass an object to the callback', function(done) {
        var params = {
          order_item_payment_status: 'PAID',
          status_notes: 'The user paid, and we thank them for it.'
        };

        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .patch(updateOrderItemsUrl, params)
          .reply(200, {
            result: {}
          });

        program.orders.updateOrderItems(orderId, params, function(error, result) {
          assert.equal(error, null);
          assert.typeOf(result, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var params = {
          order_item_payment_status: 'PAID',
          status_notes: 'The user paid, and we thank them for it.'
        },
        apiCall = nock(RO.urls.apiBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234rewardTime'
            }
          })
          .patch(updateOrderItemsUrl, params)
          .reply(200, {
            result: {status: 'OK'}
          });

        RO.program(programId).orders.updateOrderItems(orderId, params, function(error, result) {
          assert.equal(error, null);

          assert.deepEqual(result, { status: 'OK' });
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });
    });
  });
});

