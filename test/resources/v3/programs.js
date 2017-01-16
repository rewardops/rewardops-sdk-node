'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    nock      = require('nock'),
    fixtures  = require('../../fixtures/v3/programsFixtures'),
    RO        = require('../../..');

describe('v3 RO.programs', function() {
  /* jshint camelcase: false */

  before(function() {
    RO.config.set('apiVersion', 'v3');

    fixtures();
  });

  after(function() {
    RO.config.reset();
  });

  it('should be an object', function() {
    assert.typeOf(RO.programs, 'object');
  });

  describe('getAll()', function() {
    before(function() {
      RO.config.set('clientId', 'mockedclientidforprogramstests');
      RO.config.set('clientSecret', 'mockedclientsecretforprogramstests');
    });

    after(function() {
      RO.config.set('clientId', undefined);
      RO.config.set('clientSecret', undefined);
    });

    it('should pass an array to the callback', function(done) {
      RO.programs.getAll(function(error, programList) {
        assert.equal(error, null);

        assert.typeOf(programList, 'array');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var apiCall = nock(RO.urls.apiServerUrl() + '/api/v3')
        .get('/programs')
        .reply(200, {
          result: []
        });
console.log(RO.urls.apiServerUrl());
      RO.programs.getAll(function(error, programList) {
        assert.equal(error, null);

        assert.typeOf(programList, 'array');
        assert.equal(apiCall.isDone(), true);

        done();
      });
    });

    it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
      var body = {
            page: 7,
            per_page_count: 50
          },
          scope = nock(RO.urls.apiServerUrl() + '/api/v3', {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234programs'
            }
          })
          .get('/programs', body)
          .reply(200, {
            result: []
          });

      RO.programs.getAll(body, function(error, programsList) {
        assert.equal(error, null);

        assert.typeOf(programsList, 'array');
        assert.equal(scope.isDone(), true);

        done();
      });
    });
  });

  describe('get()', function() {
    before(function() {
      RO.config.set('clientId', 'mockedclientidforprogramstests');
      RO.config.set('clientSecret', 'mockedclientsecretforprogramstests');
    });

    after(function() {
      RO.config.set('clientId', undefined);
      RO.config.set('clientSecret', undefined);
    });

    it('should pass an object to the callback', function(done) {
      var id = 555;

      RO.programs.get(id, function(error, data) {
        assert.equal(error, null);

        assert.typeOf(data, 'object');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var scope = nock(RO.urls.apiServerUrl() + '/api/v3', {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234programs'
            }
          })
            .get('/programs/567')
            .reply(200, {
              result: {}
            });

      RO.programs.get('567', function(error, program) {
        assert.equal(error, null);

        assert.typeOf(program, 'object');
        assert.equal(scope.isDone(), true);

        done();
      });
    });
  });
});

