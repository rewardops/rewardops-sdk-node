'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    api       = require('../lib/api'),
    nock      = require('nock'),
    fixtures  = require('./fixtures/apiFixtures');

describe('api', function() {
  before(function() {
    fixtures();
  });

  after(function() {
    nock.restore();
  });

  it('should be an object', function() {
    expect(api).to.be.an('object');
  });

  describe('get', function() {
    it('should make an HTTP GET request to the url provided', function(done) {
      api.get('/programs', function(error, programs) {
        expect(error).to.equal(null);

        expect(programs).to.be.an('array');

        done();
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function(done) {
      api.get('/programs', function(error, programs, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');
        expect(response.status).to.equal('OK');

        done();
      });
    });
  });
});

