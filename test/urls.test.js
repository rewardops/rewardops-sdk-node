const { faker } = require('@faker-js/faker');

const config = require('../lib/config');
const urls = require('../lib/urls');
const { mockConfig } = require('./test-helpers/mock-config');

describe('urls', () => {
  let initialEnv;

  beforeAll(() => {
    initialEnv = process.env.REWARDOPS_ENV;
  });

  afterAll(() => {
    process.env.REWARDOPS_ENV = initialEnv;

    config.reset();
  });

  describe('#getApiServerUrl', () => {
    afterEach(() => {
      config.reset();
    });

    it.each`
      input            | expected
      ${'development'} | ${'DEVELOPMENT'}
      ${'qa'}          | ${'QA'}
      ${'integration'} | ${'INTEGRATION'}
      ${'uat'}         | ${'UAT'}
      ${'UAT'}         | ${'UAT'}
      ${'production'}  | ${'PRODUCTION'}
      ${'invalid'}     | ${'PRODUCTION'}
      ${undefined}     | ${'PRODUCTION'}
    `('sets the correct server url when `REWARDOPS_ENV` environment variable is `$input`', ({ input, expected }) => {
      process.env.REWARDOPS_ENV = input;
      expect(urls.getApiServerUrl()).toEqual(urls.ENVIRONMENT_URLS[expected]);
    });

    it('returns the set `apiServerUrl` config, even if `REWARDOPS_ENV` variable also set', () => {
      const mockApiServerUrl = faker.internet.url();

      process.env.REWARDOPS_ENV = 'development';

      config.init(mockConfig({ apiServerUrl: mockApiServerUrl }));

      expect(urls.getApiServerUrl()).toEqual(mockApiServerUrl);
      expect(urls.getApiBaseUrl()).toEqual(`${mockApiServerUrl}/api/${config.get('apiVersion')}`);
    });

    it('should not be altered when `piiServerUrl` is set', () => {
      const mockPiiServerUrl = faker.internet.url();

      config.init(mockConfig({ piiServerUrl: mockPiiServerUrl }));

      expect(urls.getApiServerUrl()).not.toEqual(expect.stringContaining(mockPiiServerUrl));
    });
  });

  describe('version', () => {
    test.each`
      apiVersion | expectedPath
      ${'v3'}    | ${'/api/v3'}
      ${'v5'}    | ${'/api/v5'}
    `('given $apiVersion, $expectedPath is present in the url', ({ apiVersion, expectedPath }) => {
      config.reset();
      config.init(mockConfig({ apiVersion }));

      expect(urls.getApiBaseUrl()).toEqual(`${urls.getApiServerUrl()}${expectedPath}`);
    });
  });
});
