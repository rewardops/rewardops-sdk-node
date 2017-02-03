'use strict';

var chai   = require('chai'),
    assert = chai.assert,
    path   = require('path'),
    config = require('../lib/config');

describe('config', function() {
  describe('getAll()', function() {
    it('should have the correct default values', function() {
      config.reset();

      assert.deepEqual(config.getAll(), {
        apiServerUrl: undefined,
        apiVersion:   'v4',
        clientId:     undefined,
        clientSecret: undefined,
        logFilePath:  path.resolve(__dirname, '../logs/ro.log'),
        logToFile:    false,
        timeout:      20000,
        verbose:      true
      });
    });
  });

  describe('get()', function() {
    it('should return a config value', function() {
      config.reset();

      assert.equal(config.get('apiVersion'), 'v4');
      assert.equal(config.get('verbose'), true);
    });
  });

  describe('set()', function() {
    it('should set a config value', function() {
      config.reset();

      // Returns the new value
      assert.equal(config.set('apiVersion', 'v1'), 'v1');

      // The value was set correctly
      assert.equal(config.get('apiVersion'), 'v1');
    });
  });
});

