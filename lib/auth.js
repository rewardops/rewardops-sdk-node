/* Copyright 2015 RewardOps */
'use strict';

var request = require('request');

var auth = {
  baseUrl: 'https://app.rewardops.net/api/v3',
  getToken: function(config, callback) {
    if (!config.clientId || !config.clientSecret) {
      // Fire the callback with an error if the 
      // config doesn't have a clientId and clientSecret
      var error = new Error();

      error.name = 'AuthenticationError';
      error.message = 'You must provide a ';

      if (!config.clientId && !config.clientSecret) {
        error.message += 'clientId and clientSecret';
      } else if (!config.clientId) {
        error.message += 'clientId';
      } else {
        error.message += 'clientSecret';
      }

      callback(error);
    } else {
      var url = auth.baseUrl + '/somePath/that/mustbeadded',
          options = {
            url: url,
            json: true,
            headers: {
              'X-Client-ID': config.clientId,
              'X-Client-Secret': config.clientSecret
            }
          };

      request.post(options, function(error, response, body) {
        if (error) {
          callback(error);
        } else {
          // TODO: Fix this
          callback(null, body.token);
        }
      });
    }
  }
};

module.exports = auth;

