const path = require('path');
const config = require('../lib/config');

describe('config', () => {
  describe('getAll()', () => {
    it('should have the correct default values', () => {
      config.reset();

      expect(config.getAll()).toEqual({
        apiServerUrl: undefined,
        apiVersion: 'v4',
        clientId: undefined,
        clientSecret: undefined,
        logFilePath: path.resolve(__dirname, '../logs/ro.log'),
        logToFile: false,
        timeout: 20000,
        verbose: true,
      });
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
