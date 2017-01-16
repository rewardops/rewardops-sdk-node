'use strict';

var assert           = require('chai').assert,
    packageJSON      = require('../package'),
    path             = require('path'),
    RO               = require('../'),
    expectedDefaults = {
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
      assert.deepEqual(RO.config.getAll(), expectedDefaults);
    });
  });

  describe('config', function() {
    it('should have a config property', function() {
      assert.typeOf(RO.config, 'object');
    });
  });

  describe('reset', function() {
    it('should reset the config to a clone of the defaults', function() {
      RO.config.set('foo', 'foo');
      RO.config.set('bar', 23094823094809234);

      RO.config.reset();

      assert.deepEqual(RO.config.getAll(), expectedDefaults);
      assert.equal(RO.config.get('foo', undefined));
      assert.equal(RO.config.get('bar', undefined));
    });
  });

  describe('version', function() {
    it('should have a version property', function() {
      assert.typeOf(RO.version, 'string');
    });

    it('should be the same version number as in package.json', function() {
      assert.equal(RO.version, packageJSON.version);
    });
  });
});

