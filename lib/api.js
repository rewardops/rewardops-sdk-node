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

/*
 * Returns true if obj is an object with at least one
 * key, and false otherwise
 */
function isPopulatedObject(obj) {
  return (typeof obj === 'object') && obj !== null && (Object.keys(obj).length);
}

/* Makes a call to the RewardOps API
 *
 * @param {object} options - An options object
 * @param {string} options.path - The relative path to the API endpoint
 * @param {object} options.config - The config object to use in the call (usually RO.config)
 * @param {object} options.body - (Optional) A body to send with the request
 */
function apiCall(httpMethod, options, callback) {
  /*
   * If `options.body` isn't an object, is null, or is an
   * empty object, delete it.
   */
  if (options.body && !isPopulatedObject(options.body)) {
    delete options.body;
  }

  auth.getToken(options.config, function(error, token) {
    if (error) {
      callback(error);
    } else {
      var requestOptions = {
        method: httpMethod,
        url: urls.baseUrl + options.path,
        json: true,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      if (options.body) {
        requestOptions.body = options.body;
      }

      request(requestOptions, function(error, response, responseBody) {
        /* jshint camelcase: false */
        var err;

        if (error) {
          callback(error);
        } else if (response.statusCode === 401) {
          if (token === auth.token.access_token) {
            /*
             * When the server responds to an API call
             * that the token is invalid, and the token hasn't
             * since been updated, fire an "invalidateToken"
             * event, which deletes the existing token.
             */
            emitter.emit('invalidateToken');
          }

          apiCall(httpMethod, options, callback);
        } else if (responseBody.error) {
          err = new Error();

          err.message = responseBody.error;

          callback(err);
        } else if (responseBody.result && responseBody.result.error) {
          err = new Error();

          err.message = responseBody.result.error.detail;

          callback(err);
        } else {
          callback(null, responseBody.result, responseBody);
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
  return function(options, callback) {
    apiCall(httpMethod, options, callback);
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

