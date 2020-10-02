const config = require('../lib/config');

describe('config', () => {
  describe('getAll()', () => {
    it('should have the correct default values', () => {
      config.reset();

      const actual = config.getAll();

      expect(actual).toStrictEqual(config.defaultConfig);
    });
  });

  describe('get()', () => {
    it('should return a config value', () => {
      config.reset();

      expect(config.get('apiVersion')).toEqual('v4');
      expect(config.get('verbose')).toEqual(false);
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
