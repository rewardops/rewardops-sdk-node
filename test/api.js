'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    api       = require('../lib/api'),
    fixtures  = require('./fixtures/apiFixtures');

describe('api', function() {
  /* jshint camelcase: false */

  before(function() {
    fixtures();
  });

  it('should be an object', function() {
    expect(api).to.be.an('object');
  });
  
  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function(done) {
    var config = {
      client_id: null,
      client_secret: null 
    };

    api.get('/testForAuthError', config, function(error, data, response) {
      expect(error.name).to.equal('AuthenticationError');

      expect(data).to.equal(undefined);
      expect(response).to.equal(undefined);

      done();
    });
  });

  describe('baseUrl', function() {
    var initialEnv;

    before(function() {
      initialEnv = process.env.NODE_ENV;
    });

    after(function () {
      process.env.NODE_ENV = initialEnv;

      api.setEnv();
    });

    it('should be the correct value in the development env', function() {
      process.env.NODE_ENV = 'development';
      api.setEnv();

      expect(api.baseUrl).to.equal('http://localhost:3000/api/v3');
    });

    it('should be the correct value in the integration env', function() {
      process.env.NODE_ENV = 'integration';
      api.setEnv();

      expect(api.baseUrl).to.equal('https://int.rewardops.net/api/v3');
    });

    it('should be the correct value in other environments', function() {
      process.env.NODE_ENV = 'production';
      api.setEnv();

      expect(api.baseUrl).to.equal('https://app.rewardops.net/api/v3');

      process.env.NODE_ENV = 'just some arbitrary string';
      api.setEnv();

      expect(api.baseUrl).to.equal('https://app.rewardops.net/api/v3');

      process.env.NODE_ENV = undefined;
      api.setEnv();

      expect(api.baseUrl).to.equal('https://app.rewardops.net/api/v3');
    });
  });

  describe('get', function() {
    var config = {
      client_id: 'abcdefg1234567',
      client_secret: 'abcdefg1234567'
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
        client_id: 'abcdefg1234567',
        client_secret: 'abcdefg1234567'
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

