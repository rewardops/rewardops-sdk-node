const RO = require('..');
const packageJSON = require('../package.json');
const config = require('../lib/config');
const { mockConfig } = require('./test-helpers/mock-config');

describe('RO', () => {
  describe('defaults', () => {
    it('should have the correct defaults', () => {
      RO.config.reset();

      // config should now deep equal the defaults
      expect(RO.config.getAll()).toEqual(config.defaultConfig);
    });
  });

  describe('config', () => {
    it('should have a config property', () => {
      expect(typeof RO.config).toBe('object');
    });
  });

  describe('reset', () => {
    it('should reset the config to a clone of the defaults', () => {
      RO.config.init(mockConfig({ timeout: 23023094809234, verbose: true }));

      RO.config.reset();

      expect(RO.config.getAll()).toEqual(config.defaultConfig);
      expect(RO.config.get('timeout')).toEqual(20000);
      expect(RO.config.get('verbose')).toEqual(false);
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
