'use strict';

var chai      = require('chai'),
    assert    = chai.assert,
    emitter   = require('../lib/emitter'),
    nock      = require('nock'),
    RO        = require('../'),
    fixtures  = require('./fixtures/apiFixtures');

describe('api', function() {
  before(function() {
    RO.config.set('apiVersion', 'v4');
  });

  after(function() {
    RO.config.reset();
  });
  /* jshint camelcase: false */

  it('should be an object', function() {
    assert.typeOf(RO.api, 'object');
  });

  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function(done) {
    var config = {
      clientId: null,
      clientSecret: null
    };

    RO.api.get({
      path: '/testForAuthError',
      config: config
    }, function(error, data, response) {
      assert.equal(error.name, 'AuthenticationError');

      assert.equal(data, undefined);
      assert.equal(response, undefined);

      done();
    });
  });

  it('should check to see if a new token has been received already when the server gives a token error', function(done) {
    var expires = new Date(),
        firstToken = 'HeresAToken123456789',
        secondToken = 'apiTestToken1234',
        config = {clientId: 'bamabc', clientSecret: 'boom123'};

    nock('https://app.rewardops.net/api/v4/another', {
      reqheaders: {
        'Authorization': 'Bearer ' + firstToken
      }
    })
      .filteringRequestBody(function(body) {
        // Change auth.token after the
        // request has been made but before
        // sending the response
        RO.auth.token = {
          access_token: secondToken,
          expires: expires
        };

        return body;
      })
      .get('/arbitrary-path')
      .once()
      .reply(401, null, {
        'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token expired\"',
        'Content-Type': 'text/html'
      });

    nock('https://app.rewardops.net/api/v4/another', {
      reqheaders: {
        'Authorization': 'Bearer ' + secondToken
      }
    })
      .get('/arbitrary-path')
      .once()
      .reply(200, {result: 'OK'});

    expires.setHours(expires.getHours() + 2);

    RO.config.set('clientId', config.clientId);
    RO.config.set('clientSecret', config.clientSecret);

    RO.auth.token = {
      access_token: firstToken,
      expires: expires
    };

    RO.api.get({
      path: '/another/arbitrary-path',
      config: config
    }, function(error, result) {
      assert.equal(error, null);
      assert.equal(result, 'OK');

      done();
    });
  });

  it('should request a new token and retry when the server responds that the attempted token is invalid', function(done) {
    var expires = new Date(),
        badToken = 'HeresAToken123456789',
        goodToken = 'apiTestToken1234',
        config = {clientId: 'abc', clientSecret: '123'},
        badScope = nock('https://app.rewardops.net/api/v4/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + badToken
          }
        })
          .get('/arbitrary-path')
          .reply(401, null, {
            'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token expired\"',
            'Content-Type': 'text/html'
          }),
        goodScope = nock('https://app.rewardops.net/api/v4/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + goodToken
          }
        })
          .get('/arbitrary-path')
          .reply(200, {result: 'OK'}),
        authScope = nock(RO.auth.getBaseUrl(), {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
          }
        })
          .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
          .once()
          .reply(200, {
            'access_token': goodToken,
            'token_type': 'bearer',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          }),
        listenerWasFired = false;

    expires.setHours(expires.getHours() + 2);

    emitter.on('invalidateToken', function() {
      listenerWasFired = true;
    });

    RO.config.set('clientId', config.clientId);
    RO.config.set('clientSecret', config.clientSecret);

    RO.auth.token = {
      access_token: badToken,
      expires: expires
    };

    RO.api.get({
      path: '/some/arbitrary-path',
      config: config
    }, function(error, result) {
      assert.equal(error, null);
      assert.equal(result, 'OK');

      assert.equal(authScope.isDone(), true);
      assert.equal(badScope.isDone(), true);
      assert.equal(goodScope.isDone(), true);
      assert.equal(RO.auth.token.access_token, goodToken);
      assert.equal(listenerWasFired, true);

      done();
    });
  });

  describe('get', function() {
    before(function() {
      RO.auth.token = {};

      fixtures();
    });

    it('should be a function', function() {
      assert.typeOf(RO.api.get, 'function');
    });

    it('should make an HTTP GET request to the url provided', function(done) {
      var config = {
        clientId: 'abcdefg1234567',
        clientSecret: 'abcdefg1234567'
      };

      RO.api.get({
        path: '/someTestPath',
        config: config
      }, function(error, programs) {
        assert.equal(error, null);

        assert.typeOf(programs, 'array');

        done();
      });
    });

    it('should accept a params property and pass it on to the request() call', function(done) {
      var token = 'ccccvvvv5555',
          config = {clientId: 'abc', clientSecret: '123'},
          params = {
            toppings: ['pepperoni', 'cheese', 'mushrooms'],
            customer: {name: 'J-rad', address: '123 Something St', phone: '123-456-7890'}
          };

          nock(RO.urls.apiBaseUrl(), {
            reqheaders: {
              'Authorization': 'Bearer ' + token
            }
          })
          .get('/pizzas/44/orders')
          .query(params)
          .reply(200, {result: 'OK'});

      RO.auth.token = {access_token: token, expires: new Date()};
      RO.auth.token.expires.setHours(RO.auth.token.expires.getHours() + 2);

      RO.api.get({
        path: '/pizzas/44/orders',
        params: params,
        config: config
      }, function(error, result, response) {
        assert.equal(error, null);

        assert.equal(result, 'OK');

        assert.typeOf(response, 'object');

        done();
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function(done) {
      var config = {
        clientId: 'abcdefg1234567',
        clientSecret: 'abcdefg1234567'
      };

      RO.auth.token = {};

      RO.api.get({
        path: '/someTestPath',
        config: config
      }, function(error, programs, response) {
        assert.equal(error, null);

        assert.typeOf(response, 'object');
        assert.equal(response.status, 'OK');

        done();
      });
    });
  });
});

