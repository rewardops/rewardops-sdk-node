'use strict';

var chai          = require('chai'),
    expect        = chai.expect,
    _             = require('underscore'),
    async         = require('async'),
    nock          = require('nock'),
    emitter       = require('../lib/emitter'),
    RO            = require('../');

describe('RO.auth', function() {
  /* jshint camelcase: false */

  describe('getBaseUrl()', function() {
    it('should return the correct value', function() {
      expect(RO.auth.getBaseUrl()).to.equal(RO.urls.getBaseUrl() + '/auth');
    });
  });

  describe('getToken()', function() {
    before(function() {
      RO.auth.token = {};
    });

    afterEach(function() {
      RO.auth.token = {};
    });

    it('should pass an AuthenticationError to the callback when config.client_id isn\'t present', function(done) {
      var config = {
        client_id: null,
        client_secret: 'abcdefg1234567'
      };

      RO.auth.getToken(config, function(error, response) {
        expect(error).to.be.an('error');
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
        expect(error).to.be.an('error');
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
        expect(error).to.be.an('error');
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
            'expires_in': 7200
          },
          scope = nock(RO.auth.getBaseUrl(), {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, reply);

      RO.auth.getToken(config, function() {
        expect(scope.isDone()).to.be.true;

        done();
      });
    });

    it('should send the client_id and client_secret in the correct header fields', function(done) {
      var config = {
            client_id: 'clientIdForTestingRequestHeaders',
            client_secret: 'someFakeValueForHeaderTesting'
          },
          scope = nock(RO.auth.getBaseUrl(), {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, {
              access_token: 'g0t1T',
              created_at: Math.round(+new Date()/1000),
              expires_in: 7200
            });

      RO.auth.getToken(config, function() {
        expect(scope.isDone()).to.be.true;

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

    it('should set the correct expires Date object', function(done) {
      var config = {
            client_id: '123456',
            client_secret: '0987654'
          },
          reply =  {
            'access_token': 'asdfghjkl',
            'created_at': Math.round((+new Date()/1000)),
            'expires_in': 7200,
          };

      nock(RO.auth.getBaseUrl(), {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
        }
      })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .reply(200, reply);

      RO.auth.token = {};

      RO.auth.getToken(config, function() {
        expect(RO.auth.token.expires.getTime()).to.equal(new Date((reply.created_at + reply.expires_in) * 1000).getTime());

        done();
      });
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
          scope = nock(RO.auth.getBaseUrl(), {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
            }
          })
            .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
            .reply(200, reply);

      RO.auth.token = {
        access_token: testToken,
        expires: expires
      };

      RO.auth.getToken(config, function(error, token) {
        expect(scope.isDone()).to.be.true;

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
          scope = nock(RO.auth.getBaseUrl(), {
            reqheaders: {
              'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
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
        expect(scope.isDone()).to.be.true;

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

      nock(RO.auth.getBaseUrl(), {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
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
        expect(error).to.be.an('error');
        expect(response).to.equal(undefined);

        expect(error.name).to.equal('AuthenticationError');
        expect(error.message).to.equal('The access token is invalid (error 401)');

        done();
      });
    });

    it('should timeout and pass an error to the callback when the server hasn\'t responded before config.timeout', function(done) {
      var config = {
            client_id: 'asdf0987ghjk',
            client_secret: 'asdf1234poiu',
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

      nock(RO.auth.getBaseUrl(), {
          reqheaders: {
            'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
          }
        })
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .delayConnection(config.timeout + 10)
        .times(3)
        .reply(200, reply)
        .post(RO.auth.getTokenPath(), _.extend(postBody))
        .delayConnection(config.timeout - 10)
        .once()
        .reply(200, reply);

      RO.auth.token = {};

      RO.auth.getToken(config, function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('ETIMEDOUT');

        RO.auth.getToken(config, function(error, token) {
          expect(error).to.equal(null);

          expect(token).to.equal(reply.access_token);

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
            client_id: 'raceConditionsSuck',
            client_secret: 'StopRaceConditions'
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

      nock(RO.auth.getBaseUrl(), {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
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
        expect(error).to.be.null;

        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.equal(reply.access_token);
        }

        expect(process.EventEmitter.listenerCount(emitter, 'unlockToken')).to.equal(1);

        emitter.setMaxListeners(RO.config.maxListeners || 10);

        done();
      });
    });

    it('should fire a "unlockToken" event on success, passing the new access_token as an argument', function(done) {
      var config = {
            client_id: '0987ghjk',
            client_secret: '1234poiu'
          },
          reply =  {
            'access_token': 'itWorkedForYou',
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          },
          listenerFiredToken = null;

      nock(RO.auth.getBaseUrl(), {
        reqheaders: {
          'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
        }
      })
        .post(RO.auth.getTokenPath(), {grant_type: 'client_credentials'})
        .reply(200, reply);

      RO.auth.token = {};

      emitter.once('unlockToken', function(error, token) {listenerFiredToken = token;});

      RO.auth.getToken(config, function(error, token) {
        expect(error).to.equal(null);
        expect(token).to.equal(reply.access_token);
        expect(listenerFiredToken).to.equal(reply.access_token);

        done();
      });
    });
  });

  describe('invalidateToken()', function() {
    it('should set auth.token to an empty object', function() {
      RO.auth.token = {imA: 'token'};

      RO.auth.invalidateToken();

      expect(RO.auth.token).to.deep.equal({});
    });

    it('should listen to the invalidateToken event', function() {
      RO.auth.token = {imStillA: 'token'};

      emitter.emit('invalidateToken');

      expect(RO.auth.token).to.deep.equal({});
    });
  });
});

