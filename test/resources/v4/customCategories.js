'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    nock      = require('nock'),
    RO        = require('../../..'),
    fixtures  = require('../../fixtures/v4/customCategoriesFixtures');

describe('v4 RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    RO.config.set('apiVersion', 'v4');

    fixtures();
  });

  after(function() {
    RO.config.reset();
  });

  describe.only('categories', function() {
    var id = 33,
        program = RO.program(id);

    before(function() {
      RO.config.set('clientId', 'customCategoryTest123');
      RO.config.set('clientSecret', 'itsATestGetUsedToIt');
    });

    after(function() {
      RO.config.reset();
    });

    it('should have the correct program ID', function() {
      assert.equal(program.customCategories.programId, id);
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
          .get('/programs/33/custom_categories')
          .reply(200, {
            result: []
          });

        program.customCategories.getAll(function(error, data) {
          assert.typeOf(data, 'array');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
        .get('/programs/12/custom_categories')
          .reply(200, {
            result: []
          });

        RO.program(12).customCategories.getAll(function(error, customCategoryList) {
          assert.equal(error, null);

          assert.typeOf(customCategoryList, 'array');
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
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
            .get('/programs/55/custom_categories')
            .reply(200, {
              result: []
            });

        RO.program(55).customCategories.getAll(body, function(error, customCategoriesList) {
          assert.equal(error, null);

          assert.typeOf(customCategoriesList, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });

    describe('get()', function() {

      it('should return an error if the category code is not a string', function(done) {
        program.customCategories.get(1406, function(error, data) {
          assert.instanceOf(error, Error);
          assert.equal(error.message, 'must pass a string as the category code');
          assert.equal(data, undefined);

          done();
        })
      });

      it('should pass an object to the callback', function(done) {
        nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
          .get('/programs/33/custom_categories/DOG_000007')
          .once()
          .reply(200, {
            result: {}
          });

        program.customCategories.get('DOG_000007', function(error, data) {
          assert.typeOf(data, 'object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
              .get('/programs/12/custom_categories/CAT_000002')
              .once()
              .reply(200, {
                result: {}
              });

        RO.program(12).customCategories.get('CAT_000002', function(error, customCategoryList) {
          assert.equal(error, null);

          assert.typeOf(customCategoryList, 'object');
          assert.equal(apiCall.isDone(), true);

          done();
        });
      });

      it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
        var body = {
              member_id: '5432'
            },
            scope = nock(RO.urls.apiBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234customCategoryTime'
              }
            })
            .get('/programs/55/custom_categories/RAT_000002', body)
            .reply(200, {
              result: []
            });

        RO.program(55).customCategories.get('RAT_000002', body, function(error, customCategoriesList) {
          assert.equal(error, null);

          assert.typeOf(customCategoriesList, 'array');
          assert.equal(scope.isDone(), true);

          done();
        });
      });
    });
  });
});
