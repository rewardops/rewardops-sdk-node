const nock = require('nock');

const fixtures = require('./fixtures/api.fixtures');
const RO = require('..');
const { generateBasicAuthToken } = require('../lib/utils/auth');
const emitter = require('../lib/emitter');
const { mockConfig } = require('../test/test-helpers/mock-config');
const auth = require('../lib/auth');

const defaultConfig = mockConfig({ apiVersion: 'v4' });

describe('api', () => {
  beforeAll(() => {
    RO.config.init(defaultConfig);
  });

  afterAll(() => {
    RO.config.reset();
  });

  it('should be an object', () => {
    expect(typeof RO.api).toBe('object');
  });

  it('should pass the request object to the callback', () => {
    jest.spyOn(auth, 'getToken').mockImplementationOnce((_, callback) => callback(null, 'testToken'));

    nock(RO.urls.getApiBaseUrl())
      .get('/')
      .once()
      .reply(200, { result: 'foo' });

    return new Promise(done => {
      RO.api.get(
        {
          path: '/',
          config: {},
        },
        (error, _, __, request) => {
          expect(error).toEqual(null);

          expect(request).toEqual(
            expect.objectContaining({
              headers: expect.any(Object),
              method: 'GET',
              uri: expect.any(Object),
            })
          );

          done();
        }
      );
    });
  });

  it('should handle 5XX responses', () => {
    jest.spyOn(auth, 'getToken').mockImplementationOnce((_, callback) => callback(null, 'testToken'));

    nock(RO.urls.getApiBaseUrl())
      .get('/timeout-error')
      .once()
      .reply(504);

    return new Promise(done => {
      RO.api.get(
        {
          path: '/timeout-error',
          config: {},
        },
        (error, data, response) => {
          expect(error.name).toEqual('Error');
          expect(error.status).toEqual(504);

          expect(data).toEqual(undefined);
          expect(response).toEqual(undefined);

          done();
        }
      );
    });
  });

  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', () => {
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
        (error, data, response) => {
          expect(error.name).toEqual('AuthenticationError');

          expect(data).toEqual(undefined);
          expect(response).toEqual(undefined);

          done();
        }
      );
    });
  });

  it('should check to see if a new token has been received already when the server gives a token error', () => {
    return new Promise(done => {
      const expires = new Date();
      const firstToken = 'HeresAToken123456789';
      const secondToken = 'apiTestToken1234';
      const config = { clientId: 'bamabc', clientSecret: 'boom123' };

      nock(`${RO.urls.getApiBaseUrl()}/another`, {
        reqheaders: {
          Authorization: `Bearer ${firstToken}`,
        },
      })
        .filteringRequestBody(body => {
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

      nock(`${RO.urls.getApiBaseUrl()}/another`, {
        reqheaders: {
          Authorization: `Bearer ${secondToken}`,
        },
      })
        .get('/arbitrary-path')
        .once()
        .reply(200, { result: 'OK' });

      expires.setHours(expires.getHours() + 2);

      RO.config.reset();
      RO.config.init({ ...defaultConfig, clientId: config.clientId, clientSecret: config.clientSecret });

      RO.auth.token = {
        access_token: firstToken,
        expires,
      };

      RO.api.get(
        {
          path: '/another/arbitrary-path',
          config,
        },
        (error, result) => {
          expect(error).toEqual(null);
          expect(result).toEqual('OK');

          done();
        }
      );
    });
  });

  it('should request a new token and retry when the server responds that the attempted token is invalid', () => {
    return new Promise(done => {
      const expires = new Date();
      const badToken = 'HeresAToken123456789';
      const goodToken = 'apiTestToken1234';
      const config = { clientId: 'abc', clientSecret: '123' };
      const badScope = nock(`${RO.urls.getApiBaseUrl()}/some`, {
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
      const goodScope = nock(`${RO.urls.getApiBaseUrl()}/some`, {
        reqheaders: {
          Authorization: `Bearer ${goodToken}`,
        },
      })
        .get('/arbitrary-path')
        .reply(200, { result: 'OK' });
      const authScope = nock(RO.auth.getBaseUrl(), {
        reqheaders: generateBasicAuthToken(config.clientId, config.clientSecret),
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

      emitter.on('invalidateToken', () => {
        listenerWasFired = true;
      });

      RO.config.reset();
      RO.config.init({ ...defaultConfig, clientId: config.clientId, clientSecret: config.clientSecret });

      RO.auth.token = {
        access_token: badToken,
        expires,
      };

      RO.api.get(
        {
          path: '/some/arbitrary-path',
          config,
        },
        (error, result) => {
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

  describe('get', () => {
    beforeAll(() => {
      RO.auth.token = {};

      fixtures();
    });

    it('should be a function', () => {
      expect(typeof RO.api.get).toBe('function');
    });

    it('should make an HTTP GET request to the url provided', () => {
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
          (error, programs) => {
            expect(error).toEqual(null);

            expect(Array.isArray(programs)).toBe(true);

            done();
          }
        );
      });
    });

    it('should accept a params property and pass it on to the request() call', () => {
      return new Promise(done => {
        const token = 'ccccvvvv5555';
        const config = { clientId: 'abc', clientSecret: '123' };
        const params = {
          toppings: ['pepperoni', 'cheese', 'mushrooms'],
          customer: { name: 'J-rad', address: '123 Something St', phone: '123-456-7890' },
        };

        nock(RO.urls.getApiBaseUrl(), {
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
          (error, result, response) => {
            expect(error).toEqual(null);

            expect(result).toEqual('OK');

            expect(typeof response).toBe('object');

            done();
          }
        );
      });
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', () => {
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
          (error, programs, response) => {
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
