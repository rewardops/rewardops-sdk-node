/* Copyright 2015 RewardOps */
'use strict';

var request     = require('request'),
    auth        = require('./auth'),
    emitter     = require('./emitter'),
    urls        = require('./urls'),
    log         = require('./utils/logger').log,
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

function getError(message, status, result){
  const err = new Error();
  err.message = message;
  err.status = status;
  err.result = result;
  return err;
}

/*
 * Makes a call to the RewardOps API
 *
 * @param {string} httpMethod - The name of the HTTP method
 * @param {object} options - An options object
 * @param {string} options.path - The relative path to the API endpoint
 * @param {object} options.config - The config object to use in the call (usually the result of RO.config.getAll())
 * @param {object} options.params - (Optional) A params object to send with the request. For GET requests these are sent as query params. For other requests they are sent as a JSON body.
 * @param {apiCallback} callback - The callback that handles the response
 */
function apiCall(httpMethod, options, callback) {
  /*
   * If `options.params` isn't an object, is null, or is an
   * empty object, delete it.
   */
  if (options.params && !isPopulatedObject(options.params)) {
    delete options.params;
  }

  auth.getToken(options.config, function(error, token) {
    if (error) {
      callback(error);
    } else {
      var requestOptions = {
        method: httpMethod,
        url: urls.apiBaseUrl() + options.path,
        json: true,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };

      // Some firewalls strip the body of GET requests.
      // To get around this, we send the params for GET
      // requests as query params instead of a JSON body.
      if (httpMethod === 'GET' && options.params) {
        requestOptions.qs = options.params;
      } else if (options.params) {
        requestOptions.body = options.params;
      }

      log('Request: ' + httpMethod + ' ' + urls.apiBaseUrl() + options.path);

      request(requestOptions, function(error, response, responseBody) {
        /* jshint camelcase: false */
        var err;

        if (error) {
          log(error);

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
        } else if (responseBody && responseBody.error) {
          log('API error: ' + JSON.stringify(responseBody.error, null, 2), 'error');

          const error = getError(responseBody.error, response.statusCode, responseBody.result);
          callback(error);
        } else if (responseBody && responseBody.result && responseBody.result.error) {
          log('API error: ' + JSON.stringify(responseBody.result.error.detail, null, 2), 'error');

          const error = getError(responseBody.result.error.detail, response.statusCode, responseBody.result);
          callback(error);
        } else {
          log('Success: ' + response.statusCode + ' ' + urls.apiBaseUrl() + options.path);
          
          callback(null, responseBody.result, responseBody);
        }
      });
    }
  });
}

/*
 * Used to generate
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

/*
 * Callbacks follow the Node.js error-first style.
 * @callback apiCallback
 * @param {Error|null} error
 * @param {object} result - The 'result' object from the API response body
 * @param {object} body - The full body of the response from the API. This includes pagination details, if present
 */
