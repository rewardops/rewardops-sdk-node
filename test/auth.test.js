const async = require('async');
const nock = require('nock');
const EventEmitter = require('events');
const emitter = require('../lib/emitter');
const RO = require('..');

describe('RO.auth', () => {
  describe('getBaseUrl()', () => {
    it('should return the correct value', () => {
      expect(RO.auth.getBaseUrl()).toEqual(`${RO.urls.apiBaseUrl()}/auth`);
    });
  });

  describe('getToken()', () => {
    beforeAll(() => {
      RO.auth.token = {};
    });

    afterEach(() => {
      RO.auth.token = {};
    });

    it("should pass an AuthenticationError to the callback when config.clientId isn't present", () => {
      return new Promise(done => {
        const config = {
          clientId: null,
          clientSecret: 'abcdefg1234567',
        };

        RO.auth.getToken(config, (error, response) => {
          expect(error).toBeInstanceOf(Error);
          expect(response).toEqual(undefined);

          expect(error.name).toEqual('AuthenticationError');
          expect(error.message).toEqual('You must provide a clientId');

          done();
        });
      });
    });

    it("should pass an AuthenticationError to the callback when config.clientSecret isn't present", () => {
      return new Promise(done => {
        const config = {
          clientId: '1234567abcdefg',
          clientSecret: null,
        };

        RO.auth.getToken(config, (error, response) => {
          expect(error).toBeInstanceOf(Error);
          expect(response).toEqual(undefined);

          expect(error.name).toEqual('AuthenticationError');
          expect(error.message).toEqual('You must provide a clientSecret');

          done();
        });
      });
    });

    it("should pass an AuthenticationError to the callback when config.clientId and config.clientSecret aren't present", () => {
      return new Promise(done => {
        const config = {
          clientId: null,
          clientSecret: null,
        };

        RO.auth.getToken(config, (error, response) => {
          expect(error).toBeInstanceOf(Error);
          expect(response).toEqual(undefined);

          expect(error.name).toEqual('AuthenticationError');
          expect(error.message).toEqual('You must provide a clientId and clientSecret');

          done();
        });
      });
    });

    it('should make an HTTP POST request to the correct URL', () => {
      return new Promise(done => {
        const config = {
          clientId: '1234qwer',
          clientSecret: 'gggg6666',
        };
        const reply = {
          access_token: '1111dddd',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const scope = nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .reply(200, reply);

        RO.auth.getToken(config, () => {
          expect(scope.isDone()).toEqual(true);

          done();
        });
      });
    });

    it('should send the clientId and clientSecret in the correct header fields', () => {
      return new Promise(done => {
        const config = {
          clientId: 'clientIdForTestingRequestHeaders',
          clientSecret: 'someFakeValueForHeaderTesting',
        };
        const scope = nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .reply(200, {
            access_token: 'g0t1T',
            created_at: Math.round(+new Date() / 1000),
            expires_in: 7200,
          });

        RO.auth.getToken(config, () => {
          expect(scope.isDone()).toEqual(true);

          done();
        });
      });
    });

    it('should pass an existing valid token to the callback', () => {
      return new Promise(done => {
        const expires = new Date();
        const testToken = 'thisIsMy5555555Token';
        const config = {
          clientId: 'clientIdForTestingExistingToken',
          clientSecret: 'someFakeValueForTestingExistingToken',
        };

        expires.setHours(expires.getHours() + 2);

        RO.auth.token = {
          access_token: testToken,
          expires,
        };

        RO.auth.getToken(config, (error, token) => {
          expect(error).toEqual(null);

          expect(token).toEqual(testToken);

          done();
        });
      });
    });

    it('should set the correct expires Date object', () => {
      return new Promise(done => {
        const config = {
          clientId: '123456',
          clientSecret: '0987654',
        };
        const reply = {
          access_token: 'asdfghjkl',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .reply(200, reply);

        RO.auth.token = {};

        RO.auth.getToken(config, () => {
          expect(RO.auth.token.expires.getTime()).toEqual(
            new Date((reply.created_at + reply.expires_in) * 1000).getTime()
          );

          done();
        });
      });
    });

    it('should request a new token from the server if the existing token has expired', () => {
      return new Promise(done => {
        const expires = new Date().setHours(new Date().getHours() - 3);
        const testToken = '5omeTokenWEAKRwaefrwoiejr9032';
        const config = {
          clientId: 'clientIdForTestingNewTokenRequest',
          clientSecret: 'someFakeValueForTestingNewTokenRequest',
        };
        const reply = {
          access_token: '1111dddd',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const scope = nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .reply(200, reply);

        RO.auth.token = {
          access_token: testToken,
          expires,
        };

        RO.auth.getToken(config, (error, token) => {
          expect(scope.isDone()).toEqual(true);

          expect(error).toEqual(null);

          expect(token).toEqual(reply.access_token);
          expect(token).toEqual(RO.auth.token.access_token);

          done();
        });
      });
    });

    it('should try to request a new token up to three times on server error', () => {
      return new Promise(done => {
        const config = {
          clientId: 'clientIdForTestingErrorRetry',
          clientSecret: 'someFakeValueForTestingErrorRetry',
        };
        const reply = {
          access_token: '1111dddd',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const scope = nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .twice()
          .reply(401, null, {
            'Www-Authenticate':
              'Bearer realm="api.rewardops.net", error="invalid_token", error_description="The access token is invalid"',
            'Content-Type': 'text/html',
          })
          .post(RO.auth.getTokenPath())
          .reply(200, reply);

        RO.auth.getToken(config, (error, token) => {
          expect(scope.isDone()).toEqual(true);

          expect(error).toEqual(null);

          expect(token).toEqual(reply.access_token);
          expect(token).toEqual(RO.auth.token.access_token);

          done();
        });
      });
    });

    it("should pass the server's error message to the callback after three failed attempts", () => {
      return new Promise(done => {
        const config = {
          clientId: 'fakeIdForTestingErrorPassing',
          clientSecret: 'someSecretOrAnother',
        };

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .defaultReplyHeaders({
            'Www-Authenticate':
              'Bearer realm="api.rewardops.net", error="invalid_token", error_description="The access token is invalid"',
            'Content-Type': 'text/html',
          })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .thrice()
          .reply(401);

        RO.auth.getToken(config, (error, response) => {
          expect(error).toBeInstanceOf(Error);
          expect(response).toEqual(undefined);

          expect(error.name).toEqual('AuthenticationError');
          expect(error.message).toEqual('The access token is invalid (error 401)');

          done();
        });
      });
    });

    it('should timeout and pass an error to the callback when the server times out', () => {
      return new Promise(done => {
        const config = {
          clientId: 'asdf0987ghjk',
          clientSecret: 'asdf1234poiu',
          timeout: 50,
        };
        const reply = {
          access_token: 'time0ut',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const postBody = {
          grant_type: 'client_credentials',
        };
        const timeoutError = new Error();

        timeoutError.message = 'ETIMEDOUT';

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { ...postBody })
          .times(3)
          .replyWithError(timeoutError)
          .post(RO.auth.getTokenPath(), { ...postBody })
          .once()
          .reply(200, reply);

        RO.auth.token = {};

        RO.auth.getToken(config, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('ETIMEDOUT');

          RO.auth.getToken(config, (err, token) => {
            expect(err).toEqual(null);

            expect(token).toEqual(reply.access_token);

            done();
          });
        });
      });
    });

    it('should timeout and pass an error to the callback when there is a socket timeout', () => {
      return new Promise(done => {
        const config = {
          clientId: 'asdf0987ghjk',
          clientSecret: 'asdf1234poiu',
          timeout: 50,
        };
        const reply = {
          access_token: 'time0ut',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const postBody = {
          grant_type: 'client_credentials',
        };

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { ...postBody })
          .socketDelay(config.timeout + 10)
          .times(3)
          .reply(200, reply)
          .post(RO.auth.getTokenPath(), { ...postBody })
          .socketDelay(config.timeout - 10)
          .once()
          .reply(200, reply);

        RO.auth.token = {};

        RO.auth.getToken(config, error => {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toEqual('ESOCKETTIMEDOUT');

          RO.auth.getToken(config, (err, token) => {
            expect(err).toEqual(null);

            expect(token).toEqual(reply.access_token);

            done();
          });
        });
      });
    });

    it('should avoid race conditions when multiple calls to getToken() are made when no valid token is present, and pass the same new token to all callbacks', () => {
      return new Promise(done => {
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
        const config = {
          clientId: 'raceConditionsSuck',
          clientSecret: 'StopRaceConditions',
        };
        const reply = {
          access_token: 'wonTheRace',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const badReply = {
          access_token: 'youMessedUp',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        const n = 5000;
        const arr = [];

        emitter.setMaxListeners(n + 1);

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .delayConnection(100)
          .once()
          .reply(200, reply)
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .times(n - 1)
          .reply(200, badReply);

        for (let i = 0; i < n; i++) {
          arr.push(null);
        }

        async.map(
          arr,
          (item, callback) => {
            RO.auth.getToken(config, (error, token) => {
              callback(error, token);
            });
          },
          (error, results) => {
            expect(error).toEqual(null);

            for (let i = 0; i < results.length; i++) {
              expect(results[i]).toEqual(reply.access_token);
            }

            expect(EventEmitter.listenerCount(emitter, 'unlockToken')).toEqual(1);

            emitter.setMaxListeners(RO.config.get('maxListeners') || 10);

            done();
          }
        );
      });
    });

    it('should fire a "unlockToken" event on success, passing the new access_token as an argument', () => {
      return new Promise(done => {
        const config = {
          clientId: '0987ghjk',
          clientSecret: '1234poiu',
        };
        const reply = {
          access_token: 'itWorkedForYou',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        };
        let listenerFiredToken = null;

        nock('https://app.rewardops.net/api/v4/auth', {
          reqheaders: {
            Authorization: `Basic ${Buffer.from(
              `${config.clientId}:${config.clientSecret}`
            ).toString('base64')}`,
          },
        })
          .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
          .reply(200, reply);

        RO.auth.token = {};

        emitter.once('unlockToken', (error, token) => {
          listenerFiredToken = token;
        });

        RO.auth.getToken(config, (error, token) => {
          expect(error).toEqual(null);
          expect(token).toEqual(reply.access_token);
          expect(listenerFiredToken).toEqual(reply.access_token);

          done();
        });
      });
    });
  });

  describe('invalidateToken()', () => {
    it('should set auth.token to an empty object', () => {
      RO.auth.token = { imA: 'token' };

      RO.auth.invalidateToken();

      expect(RO.auth.token).toEqual({});
    });

    it('should listen to the invalidateToken event', () => {
      RO.auth.token = { imStillA: 'token' };

      emitter.emit('invalidateToken');

      expect(RO.auth.token).toEqual({});
    });
  });
});
