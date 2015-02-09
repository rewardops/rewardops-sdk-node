/* Copyright 2015 RewardOps */
'use strict';

function api() {
  var request = require('request'),
      auth = require('./auth'),
      restMethods = [
        'GET',
        'POST',
        'PATCH'
      ],
      roApi = {
        baseUrl: 'https://app.rewardops.net/api/v3'
      };


  function generateApiMethod(restMethod) {
    return function(urlFragment, config, callback) {
      function apiCall(error, token) {
        if (error) {
          callback(error);
        } else {
          var options = {
                method: restMethod,
                url: roApi.baseUrl + urlFragment,
                json: true,
                headers: {
                  'X-Token': token
                }
              };

          request(options, function(error, response, body) {
            var err;

            if (error) {
              callback(error);
            } else if (body.error) {
              err = new Error();

              err.message = body.error;

              callback(err);
            } else if (body.result.error) {
              err = new Error();

              err.message = body.result.error.detail;

              callback(err);
            } else {
              callback(null, body.result, body);
            }
          });
        }
      }

      auth.getToken(config, apiCall);
    };
  }

  for (var i = 0; i < restMethods.length; i++) {
    roApi[restMethods[i].toLowerCase()] = generateApiMethod(restMethods[i]);
  }

  return roApi;
}

module.exports = api();

