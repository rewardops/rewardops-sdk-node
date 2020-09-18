/**
 * Configuration
 *
 * @module config
 * @copyright 2015–2020 RewardOps Inc.
 */

const path = require('path');

const { cloneDeep } = require('lodash');

/**
 * Default SDK configuration options
 *
 * @type {module:config~DefaultConfig}
 * @readonly
 * @protected
 */
const defaultConfig = {
  apiServerUrl: undefined,
  apiVersion: 'v4',
  piiServerUrl: undefined,
  clientId: undefined,
  clientSecret: undefined,
  logFilePath: path.resolve(__dirname, '../logs/ro.log'),
  logToFile: false,
  timeout: 20000,
  verbose: true,
  supportedLocales: undefined,
};

/**
 * SDK configurations object
 *
 * @type {module:config~DefaultConfig}
 * @protected
 */
let config = cloneDeep(defaultConfig);

/**
 * Get a single property from the configuration.
 *
 * @param {string} key Config key
 * @returns {string} key Config key
 */
const get = key => {
  return config[key];
};

/**
 * Returns the current keys and values of the `config`.
 *
 * @returns {module:config~DefaultConfig} Returns a clone of the `config` object.
 *    NOTE: Uses a clone so that the user cannot directly access the `config` object.
 */
const getAll = () => cloneDeep(config);

/**
 * Set a property of the configuration
 *
 * @param {string} key Key of a configuration property
 * @param {*} value Value of a configuration property
 *
 * @returns {*} The value given.
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

/**
 * Default SDK configuration options type
 *
 * @typedef module:config~DefaultConfig
 *
 * @property {string} clientId RewardOps API OAuth `client_id`.
 * @property {string} clientSecret RewardOps API OAuth `client_secret`.
 * @property {string} apiServerUrl API server URL that the SDK will use for requests.
 *   If unset, the SDK uses {@link module:urls~getApiServerUrl} to derive the server URL.
 * @property {string} [apiVersion='v4'] Version of the RewardOps API to use for requests.
 *   This affects the SDK methods available and the API baseUrl.
 * @property {string} piiServerUrl Geographic-specific PII storage server URL that the SDK will use for requests.
 * @property {Array} supportedLocales List of accepted locales for the program, in the format of Accept-Language
 *   as per RFC2616; e.g. `en-CA`, `en-US`
 * @property {string} [logFilePath='<parent dir>/logs/ro.log'] Path for log output file.
 * @property {boolean} [logToFile=false] If `true` and if {@link config.verbose} is `true`, saves log messages to file.
 * @property {number} [timeout=20000] Timeout for HTTP requests (used by {@link https://github.com/request/request Request library}).
 * @property {boolean} [verbose=false] If true, logs output to console (and optionally to file).
 */
