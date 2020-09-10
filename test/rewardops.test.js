const path = require('path');
const packageJSON = require('../package');
const RO = require('../');

const expectedDefaults = {
  apiServerUrl: undefined,
  apiVersion: 'v4',
  clientId: undefined,
  clientSecret: undefined,
  logFilePath: path.resolve(__dirname, '../logs/ro.log'),
  logToFile: false,
  timeout: 20000,
  verbose: true,
  supportedLocales: ['en-CA', 'fr-CA'],
};

describe('RO', () => {
  describe('defaults', () => {
    it('should have the correct defaults', () => {
      RO.config.reset();

      // config should now deep equal the defaults
      expect(RO.config.getAll()).toEqual(expectedDefaults);
    });
  });

  describe('config', () => {
    it('should have a config property', () => {
      expect(typeof RO.config).toBe('object');
    });
  });

  describe('reset', () => {
    it('should reset the config to a clone of the defaults', () => {
      RO.config.set('foo', 'foo');
      RO.config.set('bar', 23094823094809234);

      RO.config.reset();

      expect(RO.config.getAll()).toEqual(expectedDefaults);
      expect(RO.config.get('foo', undefined)).toEqual();
      expect(RO.config.get('bar', undefined)).toEqual();
    });
  });

  describe('version', () => {
    it('should have a version property', () => {
      expect(typeof RO.version).toBe('string');
    });

    it('should be the same version number as in package.json', () => {
      expect(RO.version).toEqual(packageJSON.version);
    });
  });
});
