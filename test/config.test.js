const path = require('path');
const faker = require('faker');

const config = require('../lib/config');
const { getTestAccessToken } = require('../test/test-helpers/auth-helpers');

const validConfig = {
  apiServerUrl: faker.internet.url(),
  apiVersion: faker.random.arrayElement(['v3', 'v4', 'v5']),
  piiServerUrl: faker.internet.url(),
  clientId: getTestAccessToken(),
  clientSecret: getTestAccessToken(),
};

describe('config', () => {
  describe('init()', () => {
    beforeEach(() => {
      config.reset();
    });

    test('an error is thrown if you call init more than once', () => {
      config.init(validConfig);

      expect(() => config.init()).toThrowError('cannot initialize config more than once');
    });

    test('the config object is frozen after init()', () => {
      const testConfig = config.init({ ...validConfig, timeout: 500 });

      testConfig.timeout = 10;

      expect(testConfig.timeout).toEqual(500);
    });

    test('an error is thrown if validation fails', () => {
      const throwsValidationError = () => config.init({ ...validConfig, apiVersion: 500 });

      expect(throwsValidationError).toThrow(
        expect.objectContaining({
          name: 'ValidationError',
          message: 'apiVersion must be one of the following values: v3, v4, v5',
        })
      );
    });
  });

  describe('getAll()', () => {
    it('should have the correct default values', () => {
      config.reset();

      const actual = config.getAll();
      const expected = {
        apiServerUrl: undefined,
        apiVersion: 'v4',
        piiServerUrl: undefined,
        clientId: undefined,
        clientSecret: undefined,
        logFilePath: path.resolve(__dirname, '../logs/ro.log'),
        logToFile: false,
        timeout: 20000,
        verbose: true,
        supportedLocales: undefined,
      };

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('get()', () => {
    it('should return a config value', () => {
      config.reset();

      expect(config.get('apiVersion')).toEqual('v4');
      expect(config.get('verbose')).toEqual(true);
    });
  });

  describe('set()', () => {
    it('should set a config value', () => {
      config.reset();

      config.init(validConfig);

      // Returns the new value
      expect(config.set('apiVersion', 'v1')).toEqual('v1');

      // The value was set correctly
      expect(config.get('apiVersion')).toEqual('v1');
    });
  });
});
