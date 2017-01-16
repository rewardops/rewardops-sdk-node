/* Copyright 2015 RewardOps */
'use strict';

var config = require('./config');

/*
 * Returns the current url for the RewardOps server. Used in
 * constructing the apiBaseUrl
 *
 * @returns {string}
 */
function apiServerUrl() {
  if (process.env.REWARDOPS_ENV === 'development') {
    return 'http://localhost:3000';
  } else if (process.env.REWARDOPS_ENV === 'integration') {
    return 'https://int.rewardops.net';
  } else {
    return 'https://app.rewardops.net';
  }
}

/*
 * Returns the current base URL for the API
 *
 * @returns {string}
 */
function apiBaseUrl() {
  return apiServerUrl() + '/api/' + config.get('apiVersion');
}

module.exports = {
  apiBaseUrl: apiBaseUrl,
  apiServerUrl: apiServerUrl
};

