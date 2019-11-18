'use strict';

var packageJSON      = require('../package'),
    path             = require('path'),
    RO               = require('../'),
    expectedDefaults = {
      apiServerUrl: undefined,
      apiVersion:   'v4',
      clientId:     undefined,
      clientSecret: undefined,
      logFilePath:  path.resolve(__dirname, '../logs/ro.log'),
      logToFile:    false,
      timeout:      20000,
      verbose:      true
    };

describe('RO', function() {
  describe('defaults', function() {
    it('should have the correct defaults', function() {
      RO.config.reset();

      // config should now deep equal the defaults
      expect(RO.config.getAll()).toEqual(expectedDefaults);
    });
  });

  describe('config', function() {
    it('should have a config property', function() {
      expect(typeof RO.config).toBe('object');
    });
  });

  describe('reset', function() {
    it('should reset the config to a clone of the defaults', function() {
      RO.config.set('foo', 'foo');
      RO.config.set('bar', 23094823094809234);

      RO.config.reset();

      expect(RO.config.getAll()).toEqual(expectedDefaults);
      expect(RO.config.get('foo', undefined)).toEqual();
      expect(RO.config.get('bar', undefined)).toEqual();
    });
  });

  describe('version', function() {
    it('should have a version property', function() {
      expect(typeof RO.version).toBe('string');
    });

    it('should be the same version number as in package.json', function() {
      expect(RO.version).toEqual(packageJSON.version);
    });
  });
});

