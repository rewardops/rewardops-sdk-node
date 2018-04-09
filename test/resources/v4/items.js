'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    nock      = require('nock'),
    RO        = require('../../..'),
    fixtures  = require('../../fixtures/v4/itemsFixtures');

describe('v4 RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    RO.config.set('apiVersion', 'v4');

    fixtures();
  });

  after(function() {
    RO.config.reset();
  });

  describe('items', function() {
    var id = 33,
        program = RO.program(id);

    before(function() {
      RO.config.set('clientId', 'itemTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    after(function() {
      RO.config.reset();
    });

    it('should have the correct program ID', function() {
      assert.equal(program.items.programId, id);
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
          .get('/programs/33/items')
          .reply(200, {
            result: []
          });

        program.items.getAll(function(error, data) {
          assert.typeOf(data, 'array');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
        .get('/programs/12/items')
          .reply(200, {
            result: []
          });

        RO.program(12).items.getAll(function(error, itemList) {
          assert.equal(error, null);

          assert.typeOf(itemList, 'array');
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
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
            .get('/programs/55/items')
            .query(params)
            .reply(200, {
              result: []
            });

        RO.program(55).items.getAll(params, function(error, itemsList) {
          assert.equal(error, null);

          assert.typeOf(itemsList, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });

    describe('get()', function() {
      it('should pass an object to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
          .get('/programs/33/items/555')
          .once()
          .reply(200, {
            result: {}
          });

        program.items.get(555, function(error, data) {
          assert.typeOf(data, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
              .get('/programs/12/items/929')
              .once()
              .reply(200, {
                result: {}
              });

        RO.program(12).items.get(929, function(error, itemList) {
          assert.equal(error, null);

          assert.typeOf(itemList, 'object');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function(done) {
        var params = {
              member_id: '5432'
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
            .get('/programs/55/items/234')
            .query(params)
            .reply(200, {
              result: []
            });

        RO.program(55).items.get(234, params, function(error, itemsList) {
          assert.equal(error, null);

          assert.typeOf(itemsList, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });

    describe('getParameter()', function() {
      it('should pass an object to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
          .get('/programs/33/items/parameters')
          .once()
          .reply(200, {
            result: {}
          });

        program.items.getParameters(function(error, data) {
          assert.typeOf(data, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
              .get('/programs/12/items/parameters')
              .once()
              .reply(200, {
                result: []
              });

        RO.program(12).items.getParameters(function(error, data) {
          assert.equal(error, null);

          assert.typeOf(data, 'array');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should accept an optional params object and pass it on to the RO.api.get() call as query params', function(done) {
        var params = {
              filter: 'CCATEGORY("CAT_TEST_001")'
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234itemTime'
              }
            })
            .get('/programs/55/items/parameters')
            .query(params)
            .reply(200, {
              result: []
            });

        RO.program(55).items.getParameters(params, function(error, data) {
          assert.equal(error, null);

          assert.typeOf(data, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });
  });
});
