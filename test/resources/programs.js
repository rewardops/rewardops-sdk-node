'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    nock      = require('nock'),
    fixtures  = require('../fixtures/programsFixtures'),
    RO        = require('../../lib/rewardops.js');

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

    it('should return an array', function(done) {
      RO.programs.getAll(function(error, programList) {
        expect(error).to.equal(null);

        expect(programList).to.be.an('array');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var apiCall = nock(RO.urls.baseUrl)
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
  });

  describe('get()', function() {
    it('should pass an object to the callback', function(done) {
      var id = 555;

      RO.programs.get(id, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });

    xit('should accept an optional options object and pass it on to the RO.api.get() call', function(done) {
       done();
    });
  });
});

