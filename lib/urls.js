/**
 * URLs
 *
 * @module urls
 * @copyright 2015–2020 RewardOps Inc.
 */

const config = require('./config');

/**
 * Enum for RewardOps environment URLs.
 *
 * @readonly
 * @enum {string}
 */
const ENVIRONMENT_URLS = {
  /** Development */
  DEVELOPMENT: 'http://localhost:3000',
  /** Quality assurance */
  QA: 'https://qa.rewardops.io',
  /** Integration */
  INTEGRATION: 'https://int-api.rewardops.io',
  /** User acceptance testing */
  UAT: 'https://uat-api.rewardops.io',
  /** Production */
  PRODUCTION: 'https://api.rewardops.io',
};

/**
 * Get the current hostname URL for the RewardOps server. Used in
 * constructing the {@link apiBaseUrl}.
 *
 * Based, in order, on either:
 *
 * 1. the `apiServerUrl` setting from {@link module:config~DefaultConfig}; or,
 * 2. a `REWARDOPS_ENV` Node environment variable (case-insensitive; see {@link module:urls~ENVIRONMENT_URLS}).
 *
 * If neither has a known value, the production server URL is returned.
 *
 * @returns {string} Returns RewardOps server hostname URL
 *
 * @example
 * ro.config.set('apiServerUrl', 'http://localhost:3000')
 *
 * @example
 * // REWARDOPS_ENV=qa npm start
 *
 * @example
 * // REWARDOPS_ENV=development npm start
 *
 * @example
 * // REWARDOPS_ENV=DEVELOPMENT npm start
 */
const getApiServerUrl = () => {
  const customApiServerUrl = config.get('apiServerUrl');

  if (customApiServerUrl) {
    return customApiServerUrl;
  }

  const rewardOpsEnv = process.env.REWARDOPS_ENV;
  let serverEnvUrl;
  if (rewardOpsEnv) {
    serverEnvUrl = Object.entries(ENVIRONMENT_URLS).find(([env]) => env === rewardOpsEnv.toUpperCase());
  }
  return serverEnvUrl ? serverEnvUrl[1] : ENVIRONMENT_URLS.PRODUCTION;
};

/**
 * Get the current RewardOps API base URL, based on the API server URL and the currently
 * configured `apiVersion` in {@link module:config}.
 *
 * @returns {string} Returns RewardOps API base URL
 */
const getApiBaseUrl = () => `${getApiServerUrl()}/api/${config.get('apiVersion')}`;

module.exports = {
  getApiBaseUrl,
  getApiServerUrl,
  ENVIRONMENT_URLS,
};
