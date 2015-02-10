'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    _       = require('underscore'),
    nock    = require('nock'),
    RO      = require('../');

describe('RO.auth', function() {
  /* jshint camelcase: false */

  describe('baseUrl', function() {
    it('should be correct', function() {
      expect(RO.auth.baseUrl).to.equal('https://app.rewardops.net/api/v3/oauth2');
    });
  });

  describe('getToken()', function() {
    beforeEach(function() {
      RO.auth.token = {};
    });

    after(function() {
      RO.auth.token = {};
    });

    it('should pass an AuthenticationError to the callback when config.client_id isn\'t present', function(done) {
      var config = {
        client_id: null,
        client_secret: 'abcdefg1234567'
      };

      RO.auth.getToken(config, function(error, response) {
        expect(error).to.be.an('object');
        expect(response).to.equal(undefined);

        expect(error.name).to.equal('AuthenticationError');
        expect(error.message).to.equal('You must provide a client_id');

        done();
      });
    });

    it('should pass an AuthenticationError to the callback when config.client_secret isn\'t present', function(done) {
      var config = {
        client_id: '1234567abcdefg',
        client_secret: null
      };

      RO.auth.getToken(config, function(error, response) {
        expect(error).to.be.an('object');
        expect(response).to.equal(undefined);

        expect(error.name).to.equal('AuthenticationError');
        expect(error.message).to.equal('You must provide a client_secret');

        done();
      });
    });

    it('should pass an AuthenticationError to the callback when config.client_id and config.client_secret aren\'t present', function(done) {
      var config = {
        client_id: null,
        client_secret: null
      };

      RO.auth.getToken(config, function(error, response) {
        expect(error).to.be.an('object');
        expect(response).to.equal(undefined);

        expect(error.name).to.equal('AuthenticationError');
        expect(error.message).to.equal('You must provide a client_id and client_secret');

        done();
      });
    });

    it('should make an HTTP POST request to the correct URL', function(done) {
      var config = {
            client_id: '1234qwer',
            client_secret: 'gggg6666'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200,
          },
          scope = nock(RO.auth.baseUrl, {reqheaders: config})
            .post(RO.auth.tokenPath)
            .reply(200, reply);

      RO.auth.getToken(config, function() {
        expect(scope.isDone()).to.be.ok();

        done();
      });
    });

    it('should send the client_id and client_secret in the correct header fields', function(done) {
      var config = {
            client_id: 'clientIdForTestingRequestHeaders',
            client_secret: 'someFakeValueForHeaderTesting'
          },
          scope = nock(RO.auth.baseUrl, {
            reqheaders: _.extend(config, {grant_type: 'client_credentials'})
          })
            .post(RO.auth.tokenPath)
            .reply(200, {
              access_token: 'g0t1T',
              created_at: Math.round(+new Date()/1000),
              expires_in: 7200
            });

      RO.auth.getToken(config, function() {
        expect(scope.isDone()).to.be.ok();

        done();
      });
    });

    it('should pass an existing valid token to the callback', function(done) {
      var expires = new Date(),
          testToken = 'thisIsMy5555555Token',
          config = {
            client_id: 'clientIdForTestingExistingToken',
            client_secret: 'someFakeValueForTestingExistingToken'
          };
      
      expires.setHours(expires.getHours() + 2);

      RO.auth.token = {
        access_token: testToken,
        expires: expires
      };

      RO.auth.getToken(config, function(error, token) {
        expect(error).to.equal(null);

        expect(token).to.equal(testToken);

        done();
      });
    });

    xit('should set the correct expires time', function(done) {
      done();
    });

    it('should request a new token from the server if the existing token has expired', function(done) {
      var expires = new Date().setHours(new Date().getHours() - 3),
          testToken = '5omeTokenWEAKRwaefrwoiejr9032',
          config = {
            client_id: 'clientIdForTestingNewTokenRequest',
            client_secret: 'someFakeValueForTestingNewTokenRequest'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          },
          scope = nock(RO.auth.baseUrl, {reqheaders: config})
            .post(RO.auth.tokenPath)
            .reply(200, reply);

      RO.auth.token = {
        access_token: testToken,
        expires: expires
      };

      RO.auth.getToken(config, function(error, token) {
        expect(scope.isDone()).to.be.ok();

        expect(error).to.equal(null);

        expect(token).to.equal(reply.access_token).and.to.equal(RO.auth.token.access_token);

        done();
      });
    });

    it('should try to request a new token up to three times on server error', function(done) {
      var config = {
            client_id: 'clientIdForTestingErrorRetry',
            client_secret: 'someFakeValueForTestingErrorRetry'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          },
          scope = nock(RO.auth.baseUrl, {reqheaders: config})
            .post(RO.auth.tokenPath)
            .twice()
            .reply(401, null, {
          'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token is invalid\"',
          'Content-Type': 'text/html'
            })
            .post(RO.auth.tokenPath)
            .reply(200, reply);

      RO.auth.getToken(config, function(error, token) {
        expect(scope.isDone()).to.be.ok();

        expect(error).to.equal(null);

        expect(token).to.equal(reply.access_token).and.to.equal(RO.auth.token.access_token);

        done();
      });
    });

    it('should pass the server\'s error message to the callback after three failed attempts', function(done) {
      var config = {
        client_id: 'fakeIdForTestingErrorPassing',
        client_secret: 'someSecretOrAnother'
      };

      nock(RO.auth.baseUrl, {reqheaders: config})
        .defaultReplyHeaders({
          'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token is invalid\"',
          'Content-Type': 'text/html'
        })
        .post(RO.auth.tokenPath)
        .thrice()
        .reply(401);

      RO.auth.getToken(config, function(error, response) {
        expect(error).to.be.an('object');
        expect(response).to.equal(undefined);

        expect(error.name).to.equal('AuthenticationError');
        expect(error.message).to.equal('The access token is invalid (error 401)');

        done();
      });
    });

    xit('should timeout and pass an error to the callback when the server hasn\t responded in the specified amout of time', function(done) {
      done();
    });

    xit('should avoid race conditions when two functions request a token when no valid token is present, and pass the same new token to both of their callbacks', function(done) {
      // TODO: Test this with a large number of concurrent requests, ex: 30
      //
      //
      //
      //
      //
      //
      done();
    });
  });
});

