'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    nock      = require('nock'),
    api       = require('../lib/api'),
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
  
  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function(done) {
    var config = {
      clientId: null,
      clientSecret: null 
    };

    api.get('/testForAuthError', config, function(error, data, response) {
      expect(error.name).to.equal('AuthenticationError');

      expect(data).to.equal(undefined);
      expect(response).to.equal(undefined);

      done();
    });
  });

  describe('get', function() {
    var config = {
      clientId: 'abcdefg1234567',
      clientSecret: 'abcdefg1234567'
    };

    it('should be a function', function() {
      expect(api.get).to.be.a('function');
    });

    it('should make an HTTP GET request to the url provided', function(done) {
      api.get('/someTestPath', config, function(error, programs) {
        expect(error).to.equal(null);

        expect(programs).to.be.an('array');

        done();
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function(done) {
      var config = {
        clientId: 'abcdefg1234567',
        clientSecret: 'abcdefg1234567'
      };

      api.get('/someTestPath', config, function(error, programs, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');
        expect(response.status).to.equal('OK');

        done();
      });
    });
  });
});

