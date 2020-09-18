const nock = require('nock');
const axios = require('axios');
const faker = require('faker');

const config = require('../../lib/config');
const { setV5Token } = require('../../lib/utils/auth');

const url = faker.internet.url();
const clientId = faker.random.uuid();
const clientSecret = faker.internet.password();

// test helpers

/**
 * Since OAuth Bearer tokens don't have a defined structure, we will
 * generate alphanumeric strings of length 24.
 *
 * https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
 *
 * @returns {string} testAccessToken
 *
 * @example
 * getTestAccessToken() // => mjpyxya9signd3g9zu1s1zkb
 */
const getTestAccessToken = () => faker.random.alphaNumeric(24);
const mockV5AuthAPI = ({ testToken = getTestAccessToken(), createdAt = Date.now() }) =>
  nock(url)
    .post('/api/v5/auth/token', {
      grant_type: 'client_credentials',
    })
    .basicAuth({ user: clientId, pass: clientSecret })
    .reply(200, {
      access_token: testToken,
      token_type: 'Bearer',
      expires_in: 7200,
      created_at: createdAt,
    });

describe('setV5Token', () => {
  beforeEach(() => {
    config.set('piiServerUrl', url);
    config.set('clientId', clientId);
    config.set('clientSecret', clientSecret);
    axios.defaults.headers.common.Authorization = undefined;
    axios.defaults.tokenData = {};
  });

  afterAll(() => {
    axios.defaults.headers.common.Authorization = undefined;
    axios.defaults.tokenData = {};
  });

  it('should set the accessToken', async () => {
    const expectedTestToken = getTestAccessToken();
    mockV5AuthAPI({ testToken: expectedTestToken });

    await setV5Token();

    expect(axios.defaults.headers.common.Authorization).toEqual(`Bearer ${expectedTestToken}`);
  });

  it('should cache the token for subsequent calls', async () => {
    const expectedTestToken = getTestAccessToken();

    mockV5AuthAPI({ testToken: expectedTestToken });

    await setV5Token();
    await setV5Token();

    expect(axios.defaults.headers.common.Authorization).toEqual(`Bearer ${expectedTestToken}`);
  });

  describe('refreshing an expired token', () => {
    it('should refresh the token if the token is expired', async () => {
      const originalTestToken = getTestAccessToken();
      const newTestToken = getTestAccessToken();

      const EXPIRATION_TIME = Date.now() + 7200 * 1000;
      const mockDate = { now: () => EXPIRATION_TIME };

      mockV5AuthAPI({ testToken: originalTestToken });
      await setV5Token();

      mockV5AuthAPI({ testToken: newTestToken });
      await setV5Token(mockDate);

      expect(axios.defaults.headers.common.Authorization).toEqual(`Bearer ${newTestToken}`);
    });
  });
});
