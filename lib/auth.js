/* Copyright 2015 RewardOps */
'use strict';

var request   = require('request'),
    baseUrl   = 'https://app.rewardops.net/api/v3/oauth2',
    tokenPath = '/token';

var auth = {
  baseUrl: baseUrl,
  token: {},
  tokenPath: tokenPath,
  tokenUrl: baseUrl + tokenPath,
  getToken: function(config, callback) {
    /* jshint camelcase: false */
    var attempts = 0,
        maxAttempts = 3;

    function requestToken(options) {
      attempts++;

      request.post(options, function(error, response, body) {
        if (error) {
          /*
           * If there's a programmatic error,
           * fire the callback with the error
           */
          callback(error);
        } else if (response.statusCode !== 200) {
          if (attempts >= maxAttempts) {
            /*
             * If the server returns an error and
             * the max amount of attempts has been
             * reached, create an error and pass
             * it to the callback
             */
            var err = new Error();

            err.name = 'AuthenticationError';
            err.message = '';

            if (response.headers['www-authenticate']) {
              err.message += response.headers['www-authenticate'].match(/error_description="(.*)"/)[1] + ' ';
            }

            err.message += '(error ' + response.statusCode + ')';

            callback(err);
          } else {
            /*
             * If the server returns an error
             * and the max number of attempts
             * hasn't been reached, try again
             */
            requestToken(options);
          }
        } else {
          auth.token = {
            access_token: body.access_token,
            expires: new Date((body.created_at + body.expires_in) * 1000)
          };

          callback(null, auth.token.access_token);
        }
      });
    }

    if (!config.client_id || !config.client_secret) {
      /*
       * Fire the callback with an error if the
       * config doesn't have a client_id and client_secret
       */
      var error = new Error();

      error.name = 'AuthenticationError';
      error.message = 'You must provide a ';

      if (!config.client_id && !config.client_secret) {
        error.message += 'client_id and client_secret';
      } else if (!config.client_id) {
        error.message += 'client_id';
      } else {
        error.message += 'client_secret';
      }

      callback(error);
    } else if (auth.token && auth.token.access_token && auth.token.expires && (auth.token.expires > new Date())) {
      /*
       * If there's already a valid token, use it
       */
      callback(null, auth.token.access_token);
    } else {
      /*
       * Otherwise, request a new token
       */
      var url = auth.tokenUrl,
          options = {
            url: url,
            json: true,
            headers: {
              grant_type: 'client_credentials',
              client_id: config.client_id,
              client_secret: config.client_secret
            }
          };

      requestToken(options);
    }
  }
};

module.exports = auth;

