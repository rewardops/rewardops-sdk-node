'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    _         = require('underscore'),
    nock      = require('nock'),
    RO        = require('../..'),
    fixtures  = require('../fixtures/programOrdersFixtures');

describe('RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    fixtures();
  });

  describe('orders', function() {
    var id = 33,
        program = RO.program(id);

    before(function() {
      RO.config.client_id = 'programTest123';
      RO.config.client_secret = 'itsATestGetUsedToIt';
    });

    after(function() {
      RO.config.client_id = undefined;
      RO.config.client_secret = undefined;
    });

    it('should be an object', function() {
      expect(program.orders).to.be.an('object');
    });

    it('should have the correct context ID', function() {
      expect(program.orders.contextId).to.equal(id);
    });

    it('should have the correct context', function() {
      expect(program.orders.context).to.equal('program');
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
          .get('/programs/33/orders', {
            member_id: 38
          })
          .reply(200, {
            result: []
          });

        program.orders.getAll(38, function(error, data) {
          expect(data).to.be.an('array');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
        .get('/programs/12/orders', {
            member_id: 3
          })
          .reply(200, {
            result: []
          });

        RO.program(12).orders.getAll(3, function(error, orderList) {
          expect(error).to.equal(null);

          expect(orderList).to.be.an('array');
          expect(apiCall.isDone()).to.be.ok();

          done();
        });
      });

      it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
        var body = {
              page: 7,
              per_page_count: 50
            },
            scope = nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
            .get('/programs/55/orders', _.extend(body, {
              member_id: 777
            }))
            .reply(200, {
              result: []
            });

        RO.program(55).orders.getAll(777, body, function(error, programsList) {
          expect(error).to.equal(null);

          expect(programsList).to.be.an('array');
          expect(scope.isDone()).to.be.ok();

          done();
        });
      });
    });

    describe('get()', function() {
      it('should pass an object to the callback', function(done) {
        nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
          .get('/programs/33/orders/555')
          .once()
          .reply(200, {
            result: {}
          });

        program.orders.get(555, function(error, data) {
          expect(data).to.be.an('object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
              .get('/programs/12/orders/929')
              .once()
              .reply(200, {
                result: {}
              });

        RO.program(12).orders.get(929, function(error, orderList) {
          expect(error).to.equal(null);

          expect(orderList).to.be.an('object');
          expect(apiCall.isDone()).to.be.ok();

          done();
        });
      });
    });

    describe('create()', function() {
      it('should pass an object to the callback', function(done) {
        var newOrder = {
              reward_id: 1234,
              member: {
                'id': 'abc123ppp'
              }
            };

        nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
          .post('/programs/33/orders', newOrder)
          .reply(200, {
            result: {}
          });

        program.orders.create(newOrder, function(error, result) {
          expect(result).to.be.an('object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var newOrder = {
              reward_id: 1234,
              retail_value: 4,
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
              }
            },
            apiCall = nock(RO.urls.baseUrl, {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234programTime'
              }
            })
              .post('/programs/33/orders', newOrder)
              .reply(200, {
                result: {status: 'OK'}
              });

        RO.program(33).orders.create(newOrder, function(error, result) {
          expect(error).to.equal(null);

          expect(result).to.deep.equal({status: 'OK'});
          expect(apiCall.isDone()).to.be.ok();

          done();
        });
      });

      it('should pass an error to the callback when a body isn\'t passed', function(done) {
        var scope = nock(RO.urls.baseUrl, {
          reqHeaders: {
            'Authorization': 'Bearer abcd1234programTime'
          }
        })
          .post('/programs/133000/orders')
          .reply(200, {
            result: {}
          });


        RO.program(133000).orders.create(function(error, result) {
          expect(error).to.be.an.instanceOf(Error);
          expect(error.message).to.equal('A body object is required');

          expect(result).to.equal(undefined);

          expect(scope.isDone()).to.not.be.ok();

          done();
        });
      });
    });
  });
});

