const { omit } = require('lodash');
const mockConsole = require('jest-mock-console');

const config = require('../lib/config');
const { ConfigurationError } = require('../lib/utils/error');
const { minimalMockConfig, mockConfig } = require('./test-helpers/mock-config');

const REQUIRED_PROPS = ['clientId', 'clientSecret'];
const OPTIONAL_PROPS = [
  'apiServerUrl',
  'apiVersion',
  'piiServerUrl',
  'supportedLocales',
  'logFilePath',
  'logToFile',
  'timeout',
  'verbose',
  'quiet',
];

describe('config', () => {
  afterEach(() => {
    config.reset();
  });

  describe('#mergeConfig', () => {
    const { mergeConfig, defaultConfig } = config;

    let mockOptionalConfig;
    beforeEach(() => {
      mockOptionalConfig = omit(mockConfig(), REQUIRED_PROPS);
    });

    it.each([null, {}])('returns the default if given %p', input => {
      expect(mergeConfig(input)).toEqual(defaultConfig);
    });

    it('merges given non-nil optional props with the default props', () => {
      expect(mergeConfig(mockOptionalConfig)).toStrictEqual({ ...defaultConfig, ...mockOptionalConfig });
    });

    it.each(OPTIONAL_PROPS)('omits nil props from the merge so default props values are used', prop => {
      const input = { ...mockOptionalConfig, [prop]: undefined };
      const expected = { ...defaultConfig, ...mockOptionalConfig, [prop]: defaultConfig[prop] };
      expect(mergeConfig(input)).toStrictEqual(expected);
    });
  });

  describe('#init', () => {
    it('throws an error if called more than once', () => {
      config.init(minimalMockConfig);

      const secondInitCall = () => config.init();
      expect(secondInitCall).toThrowError(ConfigurationError);
      expect(secondInitCall).toThrowError('Cannot initialize configuration more than once');
    });

    it('freezes the config object following invocation', () => {
      const testConfig = config.init({ ...minimalMockConfig, timeout: 500 });

      testConfig.timeout = 10;

      expect(testConfig.timeout).toEqual(500);
    });

    describe('schema validation', () => {
      it('throws an error if validation fails', () => {
        const throwsValidationError = () => config.init({ ...minimalMockConfig, apiVersion: 500 });

        expect(throwsValidationError).toThrow(
          expect.objectContaining({
            name: 'ValidationError',
            message: 'apiVersion must be one of the following values: v3, v4, v5',
          })
        );
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

      it.each(OPTIONAL_PROPS)('does not throw an error if optional %s prop is given as `undefined`', prop => {
        const omittedOptionalProp = () => config.init(mockConfig({ [prop]: undefined }));
        expect(omittedOptionalProp).not.toThrowError();
      });

      it.each(OPTIONAL_PROPS)('does not throw an error if optional %s prop is given as `null`', prop => {
        const omittedOptionalProp = () => config.init(mockConfig({ [prop]: null }));
        expect(omittedOptionalProp).not.toThrowError();
      });
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
