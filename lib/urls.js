/**
 * URLs
 *
 * @module urls
 * @copyright 2015–2019 RewardOps Inc.
 */

const config = require('./config');

/**
 * Get the current hostname URL for the RewardOps server. Used in
 * constructing the {@link apiBaseUrl}.
 *
 * Based on the `apiServerUrl` setting in {@link module:config}.
 *
 * @returns {string} Returns RewardOps server hostname URL
 */
const apiServerUrl = () => {
  const customApiServerUrl = config.get('apiServerUrl');

  if (customApiServerUrl) {
    return customApiServerUrl;
  }
  if (process.env.REWARDOPS_ENV === 'development') {
    return 'http://localhost:3000';
  }
  if (process.env.REWARDOPS_ENV === 'integration') {
    return 'https://int.rewardops.net';
  }

  return 'https://app.rewardops.net';
};

/**
 * Returns the current RewardOps API base URL, based on the currently
 * configured `apiVersion` in {@link module:config}.
 *
 * @returns {string} Returns RewardOps API base URL
 */
const apiBaseUrl = () => `${apiServerUrl()}/api/${config.get('apiVersion')}`;

module.exports = {
  apiBaseUrl,
  apiServerUrl,
};
