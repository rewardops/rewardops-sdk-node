'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    nock      = require('nock'),
    fixtures  = require('../fixtures/programsFixtures'),
    api       = require('../../lib/api'),
    RO        = require('../../lib/rewardops.js');

describe('RO.programs', function() {
  before(function() {
    RO.config.clientId = 'abcd1234';
    RO.config.clientSecret = 'abcd1234';
  });

  it('should be an object', function() {
    expect(RO.programs).to.be.an('object');
  });

  describe('getAll()', function() {
    fixtures();

    it('should return an array', function(done) {
      RO.programs.getAll(function(error, programList) {
        expect(error).to.equal(null);

        expect(programList).to.be.an('array');

        done();
      });
    });

    it('should make an HTTP get request to the correct URL', function(done) {
      var apiCall = nock(api.baseUrl)
        .get('/programs')
        .reply(200);

      RO.programs.getAll(function(error, programList) {
        expect(error).to.equal(null);

        expect(apiCall.isDone()).to.be.ok();

        done();
      });
    });
  });

  describe('get()', function() {
    it('should return an object', function(done) {
      var id = 555;

      RO.programs.get(id, function(error, data) {
        expect(error).to.equal(null);

        expect(data).to.be.an('object');

        done();
      });
    });
  });
});

