/* Copyright 2015 RewardOps */
'use strict';

var _ = require('underscore'),
    path = require('path');

/**
 * Default configuration
 *
 * @type {object}
 */
var _defaultConfig = {
  apiServerUrl: undefined,
  apiVersion:   'v4',
  clientId:     undefined,
  clientSecret: undefined,
  logFilePath:  path.resolve(__dirname, '../logs/ro.log'),
  logToFile:    false,
  timeout:      20000,
  verbose:      true
};

// Initialize with the default values
var _config = _.extend({}, _defaultConfig);

module.exports = {
  get: function(key) {
    return _config[key];
  },

  // Returns the current keys and values of the config.
  // Returns a clone, not the actual config object, so that
  // the user cannot directly access the config object.
  getAll: function() {
    return _.extend({}, _config);
  },

  set: function(key, value) {
    _config[key] = value;

    return value;
  },

  reset: function() {
    _config = _.extend({}, _defaultConfig);

    return _config;
  }
};

