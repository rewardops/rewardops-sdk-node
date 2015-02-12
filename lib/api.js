/* Copyright 2015 RewardOps */
'use strict';

var request     = require('request'),
    auth        = require('./auth'),
    emitter     = require('./emitter'),
    urls        = require('./urls'),
    httpMethods = [
      'GET',
      'POST',
      'PATCH'
    ],
    api         = {};

function apiCall(httpMethod, urlFragment, config, callback) {
  auth.getToken(config, function(error, token) {
    if (error) {
console.log(error);
      callback(error);
    } else {
      var options = {
            method: httpMethod,
            url: urls.baseUrl + urlFragment,
            json: true,
            headers: {
              'Authorization': 'Bearer ' + token
            }
          };

      request(options, function(error, response, body) {
        var err;

        if (error) {
          callback(error);
        } else if (response.statusCode === 401) {
          emitter.emit('invalidateToken');

          apiCall(httpMethod, urlFragment, config, callback);
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
  });
}

/*
 * Curried function used to generate
 * methods on the api object
 */
function generateApiMethod(httpMethod) {
  return function(urlFragment, config, callback) {
    apiCall(httpMethod, urlFragment, config, callback);
  };
}

/*
 * Loop through the HTTP methods to
 * populate the api object
 */
for (var i = 0; i < httpMethods.length; i++) {
  api[httpMethods[i].toLowerCase()] = generateApiMethod(httpMethods[i]);
}

module.exports = api;

