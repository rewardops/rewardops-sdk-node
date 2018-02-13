'use strict';

var chai          = require('chai'),
    assert        = chai.assert,
    _             = require('underscore'),
    async         = require('async'),
    nock          = require('nock'),
    emitter       = require('../lib/emitter'),
    RO            = require('../'),
    EventEmitter  = require('events');

describe('RO.auth', function() {
  /* jshint camelcase: false */

  describe('getBaseUrl()', function() {
    it('should return the correct value', function() {
      assert.equal(RO.auth.getBaseUrl(), RO.urls.apiBaseUrl() + '/auth');
    });
  });

  describe('getToken()', function() {
    before(function() {
      RO.auth.token = {};
    });

    afterEach(function() {
      RO.auth.token = {};
    });

    it('should pass an AuthenticationError to the callback when config.clientId isn\'t present', function(done) {
      var config = {
        clientId: null,
        clientSecret: 'abcdefg1234567'
      };

      RO.auth.getToken(config, function(error, response) {
        assert.typeOf(error, 'error');
        assert.equal(response, undefined);

        assert.equal(error.name, 'AuthenticationError');
        assert.equal(error.message, 'You must provide a clientId');

        done();
      });
    });

    it('should pass an AuthenticationError to the callback when config.clientSecret isn\'t present', function(done) {
      var config = {
        clientId: '1234567abcdefg',
        clientSecret: null
      };

      RO.auth.getToken(config, function(error, response) {
        assert.typeOf(error, 'error');
        assert.equal(response, undefined);

        assert.equal(error.name, 'AuthenticationError');
        assert.equal(error.message, 'You must provide a clientSecret');

        done();
      });
    });

    it('should pass an AuthenticationError to the callback when config.clientId and config.clientSecret aren\'t present', function(done) {
      var config = {
        clientId: null,
        clientSecret: null
      };

      RO.auth.getToken(config, function(error, response) {
        assert.typeOf(error, 'error');
        assert.equal(response, undefined);

        assert.equal(error.name, 'AuthenticationError');
        assert.equal(error.message, 'You must provide a clientId and clientSecret');

        done();
      });
    });

    it('should make an HTTP POST request to the correct URL', function(done) {
      var config = {
            clientId: '1234qwer',
            clientSecret: 'gggg6666'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          scope = nock('https://app.rewardops.net/api/v4/auth', {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, reply);

      RO.auth.getToken(config, function() {
        assert.equal(scope.isDone(), true);

        done();
      });
    });

    it('should send the clientId and clientSecret in the correct header fields', function(done) {
      var config = {
            clientId: 'clientIdForTestingRequestHeaders',
            clientSecret: 'someFakeValueForHeaderTesting'
          },
          scope = nock('https://app.rewardops.net/api/v4/auth', {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, {
              access_token: 'g0t1T',
              created_at: Math.round(+new Date()/1000),
              expires_in: 7200
            });

      RO.auth.getToken(config, function() {
        assert.equal(scope.isDone(), true);

        done();
      });
    });

    it('should pass an existing valid token to the callback', function(done) {
      var expires = new Date(),
          testToken = 'thisIsMy5555555Token',
          config = {
            clientId: 'clientIdForTestingExistingToken',
            clientSecret: 'someFakeValueForTestingExistingToken'
          };

      expires.setHours(expires.getHours() + 2);

      RO.auth.token = {
        access_token: testToken,
        expires: expires
      };

      RO.auth.getToken(config, function(error, token) {
        assert.equal(error, null);

        assert.equal(token, testToken);

        done();
      });
    });

    it('should set the correct expires Date object', function(done) {
      var config = {
            clientId: '123456',
            clientSecret: '0987654'
          },
          reply =  {
            'access_token': 'asdfghjkl',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          };

      nock('https://app.rewardops.net/api/v4/auth', {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
        }
      })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .reply(200, reply);

      RO.auth.token = {};

      RO.auth.getToken(config, function() {
        assert.equal(RO.auth.token.expires.getTime(), new Date((reply.created_at + reply.expires_in) * 1000).getTime());

        done();
      });
    });

    it('should request a new token from the server if the existing token has expired', function(done) {
      var expires = new Date().setHours(new Date().getHours() - 3),
          testToken = '5omeTokenWEAKRwaefrwoiejr9032',
          config = {
            clientId: 'clientIdForTestingNewTokenRequest',
            clientSecret: 'someFakeValueForTestingNewTokenRequest'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          },
          scope = nock('https://app.rewardops.net/api/v4/auth', {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, reply);

      RO.auth.token = {
        access_token: testToken,
        expires: expires
      };

      RO.auth.getToken(config, function(error, token) {
        assert.equal(scope.isDone(), true);

        assert.equal(error, null);

        assert.equal(token, reply.access_token);
        assert.equal(token, RO.auth.token.access_token);

        done();
      });
    });

    it('should try to request a new token up to three times on server error', function(done) {
      var config = {
            clientId: 'clientIdForTestingErrorRetry',
            clientSecret: 'someFakeValueForTestingErrorRetry'
          },
          reply =  {
            'access_token': '1111dddd',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          },
          scope = nock('https://app.rewardops.net/api/v4/auth', {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .twice()
            .reply(401, null, {
          'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token is invalid\"',
          'Content-Type': 'text/html'
            })
            .post(RO.auth.getTokenPath())
            .reply(200, reply);

      RO.auth.getToken(config, function(error, token) {
        assert.equal(scope.isDone(), true);

        assert.equal(error, null);

        assert.equal(token, reply.access_token);
        assert.equal(token, RO.auth.token.access_token);

        done();
      });
    });

    it('should pass the server\'s error message to the callback after three failed attempts', function(done) {
      var config = {
        clientId: 'fakeIdForTestingErrorPassing',
        clientSecret: 'someSecretOrAnother'
      };

      nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
          }
        })
        .defaultReplyHeaders({
          'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token is invalid\"',
          'Content-Type': 'text/html'
        })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .thrice()
        .reply(401);

      RO.auth.getToken(config, function(error, response) {
        assert.typeOf(error, 'error');
        assert.equal(response, undefined);

        assert.equal(error.name, 'AuthenticationError');
        assert.equal(error.message, 'The access token is invalid (error 401)');

        done();
      });
    });

    it('should timeout and pass an error to the callback when the server times out', function(done) {
      var config = {
            clientId: 'asdf0987ghjk',
            clientSecret: 'asdf1234poiu',
            timeout: 50
          },
          reply =  {
            'access_token': 'time0ut',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          postBody = {
            grant_type: 'client_credentials'
          },
          timeoutError = new Error();

      timeoutError.message = 'ETIMEDOUT';

      nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
          }
        })
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .times(3)
        .replyWithError(timeoutError)
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .once()
        .reply(200, reply);

      RO.auth.token = {};

      RO.auth.getToken(config, function(error) {
        assert.instanceOf(error, Error);
        assert.equal(error.message, 'ETIMEDOUT');

        RO.auth.getToken(config, function(error, token) {
          assert.equal(error, null);

          assert.equal(token, reply.access_token);

          done();
        });
      });
    });

    it('should timeout and pass an error to the callback when there is a socket timeout', function(done) {
      var config = {
            clientId: 'asdf0987ghjk',
            clientSecret: 'asdf1234poiu',
            timeout: 50
          },
          reply =  {
            'access_token': 'time0ut',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          postBody = {
            grant_type: 'client_credentials'
          };

      nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
          }
        })
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .socketDelay(config.timeout + 10)
        .times(3)
        .reply(200, reply)
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .socketDelay(config.timeout - 10)
        .once()
        .reply(200, reply);

      RO.auth.token = {};

      RO.auth.getToken(config, function(error) {
        assert.instanceOf(error, Error);
        assert.equal(error.message, 'ESOCKETTIMEDOUT');

        RO.auth.getToken(config, function(error, token) {
          assert.equal(error, null);

          assert.equal(token, reply.access_token);

          done();
        });
      });
    });

    it('should avoid race conditions when multiple calls to getToken() are made when no valid token is present, and pass the same new token to all callbacks', function(done) {
      // TODO: Test this with a large number of concurrent requests, ex: 100
      //
      // Implementation note:
      //
      // When the server responds to an API call that the token is invalid,
      // the API call should fire an "invalidateToken" event. Then, call
      // RO.auth.getToken() with the API call as the callback.
      //
      // Calls to RO.auth.getToken() first check whether RO.auth.tokenLocked()
      // returns `true`. If it does, the callback passed to RO.auth.getToken() is
      // added as a listener to the 'newToken' event.
      //
      // If it doesn't return true, call lockToken(),
      // which sets the local var
      // `tokenLocked` to true. (This is read by RO.auth.tokenLocked().
      // Subsequent calls then wait for the new token, per the above.)
      // Then make a call to the oauth2 server for
      // a new token as usual.
      //
      // All of this is to avoid a race condition where mutiple
      // calls for a new token happen at once, making all but
      // the last return immediately invalidated tokens.
      //
      //
      var config = {
            clientId: 'raceConditionsSuck',
            clientSecret: 'StopRaceConditions'
          },
          reply =  {
            'access_token': 'wonTheRace',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          badReply =  {
            'access_token': 'youMessedUp',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          n = 5000,
          arr = [];

      emitter.setMaxListeners(n + 1);

      nock('https://app.rewardops.net/api/v4/auth', {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
        }
      })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .delayConnection(100)
        .once()
        .reply(200, reply)
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .times(n - 1)
        .reply(200, badReply);

      for (var i = 0; i < n; i++) {
        arr.push(null);
      }

      async.map(arr, function(item, callback) {
        RO.auth.getToken(config, function(error, token) {
          callback(error, token);
        });
      }, function(error, results) {
        assert.equal(error, null);

        for (var i = 0; i < results.length; i++) {
          assert.equal(results[i], reply.access_token);
        }

        assert.equal(EventEmitter.listenerCount(emitter, 'unlockToken'), 1);

        emitter.setMaxListeners(RO.config.get('maxListeners') || 10);

        done();
      });
    });

    it('should fire a "unlockToken" event on success, passing the new access_token as an argument', function(done) {
      var config = {
            clientId: '0987ghjk',
            clientSecret: '1234poiu'
          },
          reply =  {
            'access_token': 'itWorkedForYou',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          listenerFiredToken = null;

      nock('https://app.rewardops.net/api/v4/auth', {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.clientId + ':' + config.clientSecret).toString('base64')
        }
      })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .reply(200, reply);

      RO.auth.token = {};

      emitter.once('unlockToken', function(error, token) {listenerFiredToken = token;});

      RO.auth.getToken(config, function(error, token) {
        assert.equal(error, null);
        assert.equal(token, reply.access_token);
        assert.equal(listenerFiredToken, reply.access_token);

        done();
      });
    });
  });

  describe('invalidateToken()', function() {
    it('should set auth.token to an empty object', function() {
      RO.auth.token = {imA: 'token'};

      RO.auth.invalidateToken();

      assert.deepEqual(RO.auth.token, {});
    });

    it('should listen to the invalidateToken event', function() {
      RO.auth.token = {imStillA: 'token'};

      emitter.emit('invalidateToken');

      assert.deepEqual(RO.auth.token, {});
    });
  });
});

