const nock = require('nock');
const axios = require('axios');
const faker = require('faker');

const config = require('../../lib/config');
const auth = require('../../lib/auth');
const { setV5Token } = require('../../lib/utils/axios-helpers');

const RoUrl = faker.internet.url();
const piiUrl = faker.internet.url();
const clientId = faker.random.uuid();
const clientSecret = faker.internet.password();

config.set('apiServerUrl', RoUrl);
config.set('piiServerUrl', piiUrl);
config.set('clientId', clientId);
config.set('clientSecret', clientSecret);

// test helpers

/**
 * Since OAuth Bearer tokens don't have a defined structure, we will
 * generate alphanumeric strings of length 24.
 *
 * @see {@link https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/ OAuth access tokens}
 *
 * @returns {string} testAccessToken
 *
 * @example
 * getTestAccessToken() // => mjpyxya9signd3g9zu1s1zkb
 */
const getTestAccessToken = () => faker.random.alphaNumeric(24);

const mockV5AuthAPI = () =>
  nock(piiUrl)
    .post('/api/v5/auth/token', {
      grant_type: 'client_credentials',
    })
    .basicAuth({ user: clientId, pass: clientSecret });

describe('setV5Token', () => {
  beforeEach(() => {
    axios.defaults.headers.common.Authorization = undefined;
    axios.defaults.tokenData = undefined;
  });
  // clean up after all tests in this file have run.
  afterAll(() => {
    axios.defaults.headers.common.Authorization = undefined;
    axios.defaults.tokenData = undefined;
  });

  it('should set the accessToken', async () => {
    const expectedTestToken = getTestAccessToken();
    mockV5AuthAPI().reply(200, {
      access_token: expectedTestToken,
      token_type: 'Bearer',
      expires_in: 7200,
      created_at: Date.now(),
    });

    await setV5Token();

    expect(axios.defaults.headers.common.Authorization).toEqual(`Bearer ${expectedTestToken}`);
  });

  it('should return the error from `auth.getToken` callback', async () => {
    jest.spyOn(auth, 'getToken').mockImplementation((_, callback) => callback('testError'));

    await expect(setV5Token()).rejects.toMatch('testError');
  });
});
