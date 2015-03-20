/* Copyright 2015 RewardOps */
'use strict';

var baseUrl = 'https://app.rewardops.net/api/v3',
    urls;

urls = {
  getBaseUrl: function() {
    return baseUrl;
  },
  setBaseUrl: function(url) {
    baseUrl = url;
  },
  /*
   * Changes baseUrl
   *
   * Used to set baseUrl when the SDK is loaded,
   * and is used to test that baseUrl is
   * set correctly in different environments.
   */
  setEnv: function() {
    if (process.env.REWARDOPS_ENV === 'development') {
      baseUrl = 'http://localhost:3000/api/v3';
    } else if (process.env.REWARDOPS_ENV === 'integration') {
      baseUrl = 'https://int.rewardops.net/api/v3';
    } else {
      baseUrl = 'https://app.rewardops.net/api/v3';
    }
  }
};

urls.setEnv();

module.exports = urls;

