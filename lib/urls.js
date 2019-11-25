/**
 * @copyright 2015–2019 RewardOps Inc.
 */

const config = require('./config');

/*
 * Returns the current url for the RewardOps server. Used in
 * constructing the apiBaseUrl
 *
 * @returns {string}
 */
function apiServerUrl() {
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
}

/*
 * Returns the current base URL for the API
 *
 * @returns {string}
 */
function apiBaseUrl() {
  return `${apiServerUrl()}/api/${config.get('apiVersion')}`;
}

module.exports = {
  apiBaseUrl,
  apiServerUrl,
};
