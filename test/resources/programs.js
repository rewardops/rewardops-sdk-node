'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    nock      = require('nock'),
    fixtures  = require('../fixtures/programsFixtures'),
    RO        = require('../../');

describe('RO.programs', function() {
  /* jshint camelcase: false */

  it('should be an object', function() {
    expect(RO.programs).to.be.an('object');
  });

  describe('getAll()', function() {
    fixtures();

    beforeEach(function() {
      RO.config.client_id = 'mockedclientidforprogramstests';
      RO.config.client_secret = 'mockedclientsecretforprogramstests';
    });

    it('should pass an array to the callback', function(done) {
      RO.programs.getAll(function(error, programList) {
        expect(error).to.equal(null);

        expect(programList).to.be.an('array');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var apiCall = nock(RO.urls.getBaseUrl())
        .get('/programs')
        .reply(200, {
          result: []
        });

      RO.programs.getAll(function(error, programList) {
        expect(error).to.equal(null);

        expect(programList).to.be.an('array');
        expect(apiCall.isDone()).to.be.ok();

        done();
      });
    });

    it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
      var body = {
            page: 7,
            per_page_count: 50
          },
          scope = nock(RO.urls.getBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234programs'
            }
          })
          .get('/programs', body)
          .reply(200, {
            result: []
          });

      RO.programs.getAll(body, function(error, programsList) {
        expect(error).to.equal(null);

        expect(programsList).to.be.an('array');
        expect(scope.isDone()).to.be.ok();

        done();
      });
    });
  });

  describe('get()', function() {
    beforeEach(function() {
      RO.config.client_id = 'mockedclientidforprogramstests';
      RO.config.client_secret = 'mockedclientsecretforprogramstests';
    });

    it('should pass an object to the callback', function(done) {
      var id = 555;

      RO.programs.get(id, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var scope = nock(RO.urls.getBaseUrl(), {
            reqHeaders: {
              'Authorization': 'Bearer abcd1234programs'
            }
          })
            .get('/programs/567')
            .reply(200, {
              result: {}
            });

      RO.programs.get('567', function(error, program) {
        expect(error).to.equal(null);

        expect(program).to.be.an('object');
        expect(scope.isDone()).to.be.ok();

        done();
      });
    });
  });
});

