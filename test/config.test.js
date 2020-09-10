const path = require('path');
const config = require('../lib/config');

describe('config', () => {
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
        supportedLocales: ['en-CA', 'fr-CA'],
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

      // Returns the new value
      expect(config.set('apiVersion', 'v1')).toEqual('v1');

      // The value was set correctly
      expect(config.get('apiVersion')).toEqual('v1');
    });
  });
});
