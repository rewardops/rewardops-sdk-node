/* Copyright 2015 RewardOps */
'use strict';

var urls = {
  baseUrl: 'https://app.rewardops.net/api/v3',
  /*
   * Changes urls.baseUrl
   *
   * Used to set baseUrl when the SDK is loaded,
   * and is used to test that baseUrl is
   * set correctly in different environments.
   */
  setEnv: function() {
    if (process.env.REWARDOPS_ENV === 'development') {
      urls.baseUrl = 'http://localhost:3000/api/v3';
    } else if (process.env.REWARDOPS_ENV === 'integration') {
      urls.baseUrl = 'https://int.rewardops.net/api/v3';
    } else {
      urls.baseUrl = 'https://app.rewardops.net/api/v3';
    }
  }
};

urls.setEnv();

module.exports = urls;

