const { omit } = require('lodash');
const mockConsole = require('jest-mock-console');

const config = require('../lib/config');
const { minimalMockConfig, mockConfig } = require('./test-helpers/mock-config');

const REQUIRED_PROPS = ['clientId', 'clientSecret'];

const OPTIONAL_PROPS = [
  'apiServerUrl',
  'apiVersion',
  'logFilePath',
  'logToFile',
  'timeout',
  'verbose',
  'piiServerUrl',
  'supportedLocales',
  'quiet',
];

describe('config', () => {
  afterEach(() => {
    config.reset();
  });

  describe('#init', () => {
    it('throws an error if called more than once', () => {
      config.init(minimalMockConfig);

      expect(() => config.init()).toThrowError('cannot initialize config more than once');
    });

    it('throws an error if validation fails', () => {
      const throwsValidationError = () => config.init({ ...minimalMockConfig, apiVersion: 500 });

      expect(throwsValidationError).toThrow(
        expect.objectContaining({
          name: 'ValidationError',
          message: 'apiVersion must be one of the following values: v3, v4, v5',
        })
      );
    });

    it('freezes the config object following invocation', () => {
      const testConfig = config.init({ ...minimalMockConfig, timeout: 500 });

      testConfig.timeout = 10;

      expect(testConfig.timeout).toEqual(500);
    });

    it.each(REQUIRED_PROPS)('throws an error if `%s` prop not passed', prop => {
      const omittedRequiredProp = () => config.init(omit(minimalMockConfig, [prop]));

      expect(omittedRequiredProp).toThrow(
        expect.objectContaining({
          name: 'ValidationError',
          message: `${prop} is a required field`,
        })
      );
    });

    it.each(OPTIONAL_PROPS)('does not throw an error if optional %s prop is omitted', prop => {
      const omittedOptionalProp = () => config.init(omit(mockConfig(), [prop]));
      expect(omittedOptionalProp).not.toThrowError();
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
      config.init(minimalMockConfig);

      // TODO: remove this mock once we take the Console warning out out of the `config` module
      mockConsole();
      expect(config.set('apiVersion', 'v1')).toEqual('v1');
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('deprecated'));

      expect(config.get('apiVersion')).toEqual('v1');
    });
  });
});
