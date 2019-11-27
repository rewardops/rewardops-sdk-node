const config = require('../lib/config');
const urls = require('../lib/urls');

describe('urls', () => {
  let initialEnv;

  beforeAll(() => {
    initialEnv = process.env.REWARDOPS_ENV;
  });

  afterAll(() => {
    process.env.REWARDOPS_ENV = initialEnv;

    config.reset();
  });

  describe('apiServerUrl()', () => {
    afterAll(() => {
      config.set('apiServerUrl', undefined);
    });

    it('should have the correct server url in the development env', () => {
      process.env.REWARDOPS_ENV = 'development';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.DEVELOPMENT);
    });

    it('should have the correct server url in the QA env', () => {
      process.env.REWARDOPS_ENV = 'qa';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.QA);
    });

    it('should have the correct server url in the integration env', () => {
      process.env.REWARDOPS_ENV = 'integration';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.INTEGRATION);
    });

    it('should have the correct server url in the UAT env', () => {
      process.env.REWARDOPS_ENV = 'uat';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.UAT);
    });

    it('should have the correct server url in the UAT env (uppercase)', () => {
      process.env.REWARDOPS_ENV = 'UAT';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.UAT);
    });

    it('should have the correct server url in production environment', () => {
      process.env.REWARDOPS_ENV = 'production';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.PRODUCTION);
    });

    it('should have the correct server url in arbitrary environment', () => {
      process.env.REWARDOPS_ENV = 'just some arbitrary string';

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.PRODUCTION);
    });

    it('should have the production server url in unknown environment', () => {
      // reset, just in case
      process.env.REWARDOPS_ENV = undefined;

      expect(urls.apiServerUrl()).toEqual(urls.ENVIRONMENT_URLS.PRODUCTION);
    });

    it('should return the apiServerUrl from the config if it is set', () => {
      const EXAMPLE_URL = 'http://example.com/test';

      process.env.REWARDOPS_ENV = 'development';
      config.set('apiServerUrl', EXAMPLE_URL);

      expect(urls.apiServerUrl()).toEqual(EXAMPLE_URL);
      expect(urls.apiBaseUrl()).toEqual(`${EXAMPLE_URL}/api/${config.get('apiVersion')}`);
    });
  });

  describe('version', () => {
    it('should have the correct version at the end of the path', () => {
      config.set('apiVersion', 'v3');

      expect(urls.apiBaseUrl()).toEqual(`${urls.apiServerUrl()}/api/v3`);

      config.set('apiVersion', 'v5');

      expect(urls.apiBaseUrl()).toEqual(`${urls.apiServerUrl()}/api/v5`);

      config.set('apiVersion', 'v6-beta');

      expect(urls.apiBaseUrl()).toEqual(`${urls.apiServerUrl()}/api/v6-beta`);
    });
  });
});
