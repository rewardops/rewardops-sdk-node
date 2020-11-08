const nock = require('nock');
const axios = require('axios');
const faker = require('faker');

const config = require('../../lib/config');
const auth = require('../../lib/auth');
const { setPiiToken } = require('../../lib/utils/axios-helpers');
const { getTestAccessToken } = require('../test-helpers/auth-helpers');
const { mockConfig } = require('../test-helpers/mock-config');

const apiServerUrl = faker.internet.url();
const piiServerUrl = faker.internet.url();
const clientId = faker.random.uuid();
const clientSecret = faker.internet.password();

config.init(
  mockConfig({
    apiServerUrl,
    piiServerUrl,
    clientId,
    clientSecret,
  })
);

const mockV5AuthAPI = () =>
  nock(piiServerUrl)
    .post('/api/v5/auth/token', {
      grant_type: 'client_credentials',
    })
    .basicAuth({ user: clientId, pass: clientSecret });

describe('setPiiToken', () => {
  let ordersClient;

  beforeEach(() => {
    ordersClient = axios.create();
  });

  it('should set the accessToken', async () => {
    const expectedTestToken = getTestAccessToken();
    mockV5AuthAPI().reply(200, {
      access_token: expectedTestToken,
      token_type: 'Bearer',
      expires_in: 7200,
      created_at: Date.now(),
    });

    await setPiiToken(ordersClient);

    expect(ordersClient.defaults.headers.common.Authorization).toEqual(`Bearer ${expectedTestToken}`);
  });

  it('should return the error from `auth.getToken` callback', async () => {
    jest.spyOn(auth, 'getToken').mockImplementationOnce((_, callback) => callback('testError'));

    await expect(setPiiToken(ordersClient)).rejects.toMatch('testError');
  });
});
