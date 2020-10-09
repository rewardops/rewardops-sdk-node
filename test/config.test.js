const faker = require('faker');
const mockConsole = require('jest-mock-console');

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
  afterEach(() => {
    config.reset();
  });

  describe('#init', () => {
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

  describe('#getAll', () => {
    it('should have the correct default values', () => {
      const actual = config.getAll();

      expect(actual).toStrictEqual(config.defaultConfig);
    });
  });

  describe('#get', () => {
    it('should return a config value', () => {
      expect(config.get('apiVersion')).toEqual('v4');
      expect(config.get('verbose')).toEqual(false);
    });
  });

  describe('#set', () => {
    it('should set and return (then be able to get) a config value', () => {
      config.init(validConfig);

      // TODO: remove this mock once we take the Console warning out out of the `config` module
      mockConsole();
      expect(config.set('apiVersion', 'v1')).toEqual('v1');
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('deprecated'));

      expect(config.get('apiVersion')).toEqual('v1');
    });
  });
});
