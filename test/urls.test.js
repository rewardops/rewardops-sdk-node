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

      expect(urls.apiServerUrl()).toEqual('http://localhost:3000');
    });

    it('should have the correct server url in the integration env', () => {
      process.env.REWARDOPS_ENV = 'integration';

      expect(urls.apiServerUrl()).toEqual('https://int.rewardops.net');
    });

    it('should have the correct server url in other environments', () => {
      process.env.REWARDOPS_ENV = 'production';

      expect(urls.apiServerUrl()).toEqual('https://app.rewardops.net');

      process.env.REWARDOPS_ENV = 'just some arbitrary string';

      expect(urls.apiServerUrl()).toEqual('https://app.rewardops.net');

      process.env.REWARDOPS_ENV = undefined;

      expect(urls.apiServerUrl()).toEqual('https://app.rewardops.net');
    });

    it('should return the apiServerUrl from the config if it is set', () => {
      process.env.REWARDOPS_ENV = 'development';
      config.set('apiServerUrl', 'http://example.com/test');

      expect(urls.apiServerUrl()).toEqual('http://example.com/test');
      expect(urls.apiBaseUrl()).toEqual(`http://example.com/test/api/${config.get('apiVersion')}`);
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
