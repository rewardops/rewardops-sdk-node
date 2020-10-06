const RO = require('../');
const packageJSON = require('../package');
const config = require('../lib/config');

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
      RO.config.set('foo', 'foo');
      RO.config.set('bar', 23094823094809234);

      RO.config.reset();

      expect(RO.config.getAll()).toEqual(config.defaultConfig);
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
