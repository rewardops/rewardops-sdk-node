/**
 * Configuration
 *
 * @module config
 * @copyright 2015–2019 RewardOps Inc.
 */

const path = require('path');

const { cloneDeep } = require('lodash');

/**
 * Default SDK configuration
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

/**
 * SDK configurations object
 *
 * @type {object}
 * @property {string} apiServerUrl RewardOps API URL to which the SDK will make requests.
 * @property {string} [apiVersion] The version of the RewardOps API to use.
 *   This affects the SDK methods available and the API baseUrl.
 * @property {string} clientId Your RewardOps API OAuth `client_id`.
 * @property {string} clientSecret Your RewardOps API OAuth `client_secret`.
 * @property {string} [logFilePath] The file path where the log file should be saved.
 * @property {boolean} [logToFile] If `true` and if {@link config.verbose} is `true`, saves log messages to file.
 * @property {number} [timeout] Timeout for HTTP requests (used by [Request]{@link https://github.com/request/request}).
 * @property {boolean} [verbose] If true, logs output to console (and optionally to file).
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
