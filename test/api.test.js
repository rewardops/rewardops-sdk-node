const nock = require('nock');
const emitter = require('../lib/emitter');
const RO = require('..');
const fixtures = require('./fixtures/apiFixtures');

describe('api', function() {
  beforeAll(function() {
    RO.config.set('apiVersion', 'v4');
  });

  afterAll(function() {
    RO.config.reset();
  });

  it('should be an object', function() {
    expect(typeof RO.api).toBe('object');
  });

  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function() {
    return new Promise(done => {
      const config = {
        clientId: null,
        clientSecret: null,
      };

      RO.api.get(
        {
          path: '/testForAuthError',
          config,
        },
        function(error, data, response) {
          expect(error.name).toEqual('AuthenticationError');

          expect(data).toEqual(undefined);
          expect(response).toEqual(undefined);

          done();
        }
      );
    });
  });

  it('should check to see if a new token has been received already when the server gives a token error', function() {
    return new Promise(done => {
      const expires = new Date();
      const firstToken = 'HeresAToken123456789';
      const secondToken = 'apiTestToken1234';
      const config = { clientId: 'bamabc', clientSecret: 'boom123' };

      nock('https://app.rewardops.net/api/v4/another', {
        reqheaders: {
          Authorization: `Bearer ${firstToken}`,
        },
      })
        .filteringRequestBody(function(body) {
          // Change auth.token after the
          // request has been made but before
          // sending the response
          RO.auth.token = {
            access_token: secondToken,
            expires,
          };

          return body;
        })
        .get('/arbitrary-path')
        .once()
        .reply(401, null, {
          'Www-Authenticate':
            'Bearer realm="api.rewardops.net", error="invalid_token", error_description="The access token expired"',
          'Content-Type': 'text/html',
        });

      nock('https://app.rewardops.net/api/v4/another', {
        reqheaders: {
          Authorization: `Bearer ${secondToken}`,
        },
      })
        .get('/arbitrary-path')
        .once()
        .reply(200, { result: 'OK' });

      expires.setHours(expires.getHours() + 2);

      RO.config.set('clientId', config.clientId);
      RO.config.set('clientSecret', config.clientSecret);

      RO.auth.token = {
        access_token: firstToken,
        expires,
      };

      RO.api.get(
        {
          path: '/another/arbitrary-path',
          config,
        },
        function(error, result) {
          expect(error).toEqual(null);
          expect(result).toEqual('OK');

          done();
        }
      );
    });
  });

  it('should request a new token and retry when the server responds that the attempted token is invalid', function() {
    return new Promise(done => {
      const expires = new Date();
      const badToken = 'HeresAToken123456789';
      const goodToken = 'apiTestToken1234';
      const config = { clientId: 'abc', clientSecret: '123' };
      const badScope = nock('https://app.rewardops.net/api/v4/some', {
        reqheaders: {
          Authorization: `Bearer ${badToken}`,
        },
      })
        .get('/arbitrary-path')
        .reply(401, null, {
          'Www-Authenticate':
            'Bearer realm="api.rewardops.net", error="invalid_token", error_description="The access token expired"',
          'Content-Type': 'text/html',
        });
      const goodScope = nock('https://app.rewardops.net/api/v4/some', {
        reqheaders: {
          Authorization: `Bearer ${goodToken}`,
        },
      })
        .get('/arbitrary-path')
        .reply(200, { result: 'OK' });
      const authScope = nock(RO.auth.getBaseUrl(), {
        reqheaders: {
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
            'base64'
          )}`,
        },
      })
        .post(RO.auth.getTokenPath(), { grant_type: 'client_credentials' })
        .once()
        .reply(200, {
          access_token: goodToken,
          token_type: 'bearer',
          created_at: Math.round(+new Date() / 1000),
          expires_in: 7200,
        });
      let listenerWasFired = false;

      expires.setHours(expires.getHours() + 2);

      emitter.on('invalidateToken', function() {
        listenerWasFired = true;
      });

      RO.config.set('clientId', config.clientId);
      RO.config.set('clientSecret', config.clientSecret);

      RO.auth.token = {
        access_token: badToken,
        expires,
      };

      RO.api.get(
        {
          path: '/some/arbitrary-path',
          config,
        },
        function(error, result) {
          expect(error).toEqual(null);
          expect(result).toEqual('OK');

          expect(authScope.isDone()).toEqual(true);
          expect(badScope.isDone()).toEqual(true);
          expect(goodScope.isDone()).toEqual(true);
          expect(RO.auth.token.access_token).toEqual(goodToken);
          expect(listenerWasFired).toEqual(true);

          done();
        }
      );
    });
  });

  describe('get', function() {
    beforeAll(function() {
      RO.auth.token = {};

      fixtures();
    });

    it('should be a function', function() {
      expect(typeof RO.api.get).toBe('function');
    });

    it('should make an HTTP GET request to the url provided', function() {
      return new Promise(done => {
        const config = {
          clientId: 'abcdefg1234567',
          clientSecret: 'abcdefg1234567',
        };

        RO.api.get(
          {
            path: '/someTestPath',
            config,
          },
          function(error, programs) {
            expect(error).toEqual(null);

            expect(Array.isArray(programs)).toBe(true);

            done();
          }
        );
      });
    });

    it('should accept a params property and pass it on to the request() call', function() {
      return new Promise(done => {
        const token = 'ccccvvvv5555';
        const config = { clientId: 'abc', clientSecret: '123' };
        const params = {
          toppings: ['pepperoni', 'cheese', 'mushrooms'],
          customer: {
            name: 'J-rad',
            address: '123 Something St',
            phone: '123-456-7890',
          },
        };

        nock(RO.urls.apiBaseUrl(), {
          reqheaders: {
            Authorization: `Bearer ${token}`,
          },
        })
          .get('/pizzas/44/orders')
          .query(params)
          .reply(200, { result: 'OK' });

        RO.auth.token = { access_token: token, expires: new Date() };
        RO.auth.token.expires.setHours(RO.auth.token.expires.getHours() + 2);

        RO.api.get(
          {
            path: '/pizzas/44/orders',
            params,
            config,
          },
          function(error, result, response) {
            expect(error).toEqual(null);

            expect(result).toEqual('OK');

            expect(typeof response).toBe('object');

            done();
          }
        );
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function() {
      return new Promise(done => {
        const config = {
          clientId: 'abcdefg1234567',
          clientSecret: 'abcdefg1234567',
        };

        RO.auth.token = {};

        RO.api.get(
          {
            path: '/someTestPath',
            config,
          },
          function(error, programs, response) {
            expect(error).toEqual(null);

            expect(typeof response).toBe('object');
            expect(response.status).toEqual('OK');

            done();
          }
        );
      });
    });
  });
});
