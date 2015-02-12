'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    _         = require('underscore'),
    emitter   = require('../lib/emitter'),
    nock      = require('nock'),
    RO        = require('../'),
    fixtures  = require('./fixtures/apiFixtures');

describe('api', function() {
  /* jshint camelcase: false */

  it('should be an object', function() {
    expect(RO.api).to.be.an('object');
  });
  
  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function(done) {
    var config = {
      client_id: null,
      client_secret: null 
    };

    RO.api.get({
      path: '/testForAuthError',
      config: config
    }, function(error, data, response) {
      expect(error.name).to.equal('AuthenticationError');

      expect(data).to.equal(undefined);
      expect(response).to.equal(undefined);

      done();
    });
  });

  it('should check to see if a new token has been received already when the server gives a token error', function(done) {
    var expires = new Date(),
        firstToken = 'HeresAToken123456789',
        secondToken = 'apiTestToken1234',
        config = {client_id: 'bamabc', client_secret: 'boom123'};

    nock(RO.urls.baseUrl + '/another', {
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

    nock(RO.urls.baseUrl + '/another', {
      reqheaders: {
        'Authorization': 'Bearer ' + secondToken
      }
    })
      .get('/arbitrary-path')
      .once()
      .reply(200, {result: 'OK'});

    expires.setHours(expires.getHours() + 2);

    RO.config.client_id = config.client_id;
    RO.config.client_secret = config.client_secret;

    RO.auth.token = {
      access_token: firstToken,
      expires: expires
    };

    RO.api.get({
      path: '/another/arbitrary-path',
      config: config
    }, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.equal('OK');

      done();
    });
  });

  it('should request a new token and retry when the server responds that the attempted token is invalid', function(done) {
    var expires = new Date(),
        badToken = 'HeresAToken123456789',
        goodToken = 'apiTestToken1234',
        config = {client_id: 'abc', client_secret: '123'},
        badScope = nock(RO.urls.baseUrl + '/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + badToken
          }
        })
          .get('/arbitrary-path')
          .reply(401, null, {
            'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token expired\"',
            'Content-Type': 'text/html'
          }),
        goodScope = nock(RO.urls.baseUrl + '/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + goodToken
          } 
        })
          .get('/arbitrary-path')
          .reply(200, {result: 'OK'}),
        authScope = nock(RO.auth.baseUrl)
          .post(RO.auth.tokenPath, _.extend({}, config, {grant_type: 'client_credentials'}))
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

    RO.config.client_id = config.client_id;
    RO.config.client_secret = config.client_secret;

    RO.auth.token = {
      access_token: badToken,
      expires: expires
    };

    RO.api.get({
      path: '/some/arbitrary-path',
      config: config
    }, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.equal('OK');

      expect(authScope.isDone()).to.be.ok();
      expect(badScope.isDone()).to.be.ok();
      expect(goodScope.isDone()).to.be.ok();
      expect(RO.auth.token.access_token).to.equal(goodToken);
      expect(listenerWasFired).to.equal(true);

      done();
    });
  });

  describe('get', function() {
    before(function() {
      fixtures();
      RO.auth.token = {};
    });

    it('should be a function', function() {
      expect(RO.api.get).to.be.a('function');
    });

    it('should make an HTTP GET request to the url provided', function(done) {
      var config = {
        client_id: 'abcdefg1234567',
        client_secret: 'abcdefg1234567'
      };

      RO.api.get({
        path: '/someTestPath',
        config: config
      }, function(error, programs) {
        expect(error).to.equal(null);

        expect(programs).to.be.an('array');

        done();
      });
    });

    it('should accept a body property and pass it on to the request() call', function(done) {
    var token = 'ccccvvvv5555',
        config = {client_id: 'abc', client_secret: '123'},
        body = {
          toppings: ['pepperoni', 'cheese', 'mushrooms'],
          customer: {name: 'J-rad', address: '123 Something St', phone: '123-456-7890'}
        };

        nock(RO.urls.baseUrl, {
          reqheaders: {
            'Authorization': 'Bearer ' + token
          }
        })
        .post('/pizzas/44/orders', body)
          .reply(200, {result: 'OK'});

      RO.auth.token = {access_token: token, expires: new Date()};
      RO.auth.token.expires.setHours(RO.auth.token.expires.getHours() + 2);

      RO.api.post({
        path: '/pizzas/44/orders',
        body: body,
        config: config
      }, function(error, result, response) {
        expect(error).to.equal(null);

        expect(result).to.equal('OK');

        expect(response).to.be.an('object');

        done();
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function(done) {
      var config = {
        client_id: 'abcdefg1234567',
        client_secret: 'abcdefg1234567'
      };

      RO.auth.token = {};

      RO.api.get({
        path: '/someTestPath',
        config: config
      }, function(error, programs, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');
        expect(response.status).to.equal('OK');

        done();
      });
    });
  });
});

