/* Copyright 2019 RewardOps */

const path = require('path');

/**
 * Default configuration
 *
 * @type {object}
 */
const defaultConfig = {
  apiServerUrl: undefined,
  apiVersion: 'v4',
  clientId: undefined,
  clientSecret: undefined,
  logFilePath: path.resolve(__dirname, '../logs/ro.log'),
  logToFile: false,
  timeout: 20000,
  verbose: true,
};

// Initialize with the default values
const config = { ...defaultConfig };

module.exports = {
  get(key) {
    return config[key];
  },

  // Returns the current keys and values of the config.
  // Returns a clone, not the actual config object, so that
  // the user cannot directly access the config object.
  getAll() {
    return { ...config };
  },

  set(key, value) {
    config[key] = value;

    return value;
  },

  reset() {
    return { ...defaultConfig };
  },
};
