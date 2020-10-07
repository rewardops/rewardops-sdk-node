/**
 * Configuration
 *
 * @module config
 * @copyright 2015–2020 RewardOps Inc.
 */

const path = require('path');

const { cloneDeep } = require('lodash');
const { configSchema } = require('./schemas/config');

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
  supportedLocales: undefined,
  clientId: undefined,
  clientSecret: undefined,
  timeout: 20000,
  logFilePath: path.resolve(__dirname, '../logs/ro.log'),
  logToFile: false,
  verbose: false,
  quiet: false,
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
 *
 * @deprecated since version 1.3.0
 */
const set = (key, value) => {
  // NOTE: we cannot use `log` function here as this module is a dependency of logger module.
  console.warn('config.set is deprecated, please use config.init instead');

  config = { ...config, [key]: value };
  return value;
};

let initialized = false;

/**
 * Reset the configuration to defaults
 *
 * Reset the `initialized` boolean to false allowing config.init to be called again.
 */
const reset = () => {
  config = cloneDeep(defaultConfig);
  initialized = false;
};

/**
 * Set all properties of the configuration. 
 * 
 * **NOTE: Can only be performed once per runtime!**
 *
 * This is a much safer configuration approach than the `set` method, as it eliminates
 * some potential edges case issues for PII-enabled programs.
 *
 * @param {module:config~DefaultConfig} initialConfig Configuration values that will override default values.
 *
 * @returns {module:config~DefaultConfig} Frozen config object.
 */
const init = initialConfig => {
  if (initialized) {
    throw new Error('cannot initialize config more than once');
  }

  initialized = true;

  const newConfig = { ...defaultConfig, ...initialConfig };

  configSchema.validateSync(newConfig);

  config = newConfig;

  return Object.freeze(config);
};

module.exports = {
  init,
  get,
  getAll,
  set,
  reset,
  defaultConfig,
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
 * @property {number} [timeout=20000] Timeout for HTTP requests (used by {@link https://github.com/request/request Request library}).
 * @property {string} [logFilePath='<parent dir>/logs/ro.log'] Path for log output file.
 * @property {boolean} [logToFile=false] If `true` and if {@link config.verbose} is `true`, saves log messages to file.
 * @property {boolean} [verbose=false] Run SDK with verbose logging (as well as in optional file).
 * @property {boolean} [quiet=false] Run SDK with minimal logging(as well as in optional file). NOTE: Superceded by `verbose` if both are `true`.
 */
