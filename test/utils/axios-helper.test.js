const nock = require('nock');
const axios = require('axios');
const faker = require('faker');

const config = require('../../lib/config');
const auth = require('../../lib/auth');
const { setPiiToken } = require('../../lib/utils/axios-helpers');
const { getTestAccessToken } = require('../test-helpers/auth-helpers');

const RoUrl = faker.internet.url();
const piiUrl = faker.internet.url();
const clientId = faker.random.uuid();
const clientSecret = faker.internet.password();

config.set('apiServerUrl', RoUrl);
config.set('piiServerUrl', piiUrl);
config.set('clientId', clientId);
config.set('clientSecret', clientSecret);
config.set('quiet', true);

const mockV5AuthAPI = () =>
  nock(piiUrl)
    .post('/api/v5/auth/token', {
      grant_type: 'client_credentials',
    })
    .basicAuth({ user: clientId, pass: clientSecret });

describe('setPiiToken', () => {
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

    await setPiiToken();

    expect(axios.defaults.headers.common.Authorization).toEqual(`Bearer ${expectedTestToken}`);
  });

  it('should return the error from `auth.getToken` callback', async () => {
    jest.spyOn(auth, 'getToken').mockImplementation((_, callback) => callback('testError'));

    await expect(setPiiToken()).rejects.toMatch('testError');
  });
});
