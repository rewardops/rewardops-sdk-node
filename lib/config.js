/**
 * Configuration
 *
 * @module config
 * @license
 * Copyright 2019 RewardOps Inc.
 */

const path = require('path');

const { cloneDeep } = require('lodash');

/**
 * Default configuration
 *
 * @type {object}
 * @private
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

/**
 * Initialize with the default values
 *
 * @type {object}
 * @private
 */
let config = cloneDeep(defaultConfig);

/**
 * Get a single property from the configuration.
 *
 * @param {string} key Config key
 */
const get = key => {
  return config[key];
};

/**
 * Returns the current keys and values of the config.
 *
 * NOTE: Returns a clone, not the actual config object, so that the user cannot directly access the config object.
 */
const getAll = () => {
  return cloneDeep(config);
};

/**
 * Set a property of the configuration
 * @param {string} key Key of a configuration property
 * @param {*} value Value of a configuration property
 */
const set = (key, value) => {
  config[key] = value;
  return value;
};

/**
 * Reset the configuration to defaults
 */
const reset = () => {
  config = cloneDeep(defaultConfig);
};

module.exports = {
  get,
  getAll,
  set,
  reset,
};
