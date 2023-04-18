/**
 * API
 *
 * @module api
 * @copyright 2015–2020 RewardOps Inc.
 */

const request = require('request');
const { isEmpty } = require('lodash');

const auth = require('./auth');
const emitter = require('./emitter');
const urls = require('./urls');
const { log } = require('./utils/logger');

/**
 * Generate extended `Error` object with `message`, `status`, and `result` properties.
 *
 * @param {string} message Error message
 * @param {string|number} status HTTP status code
 * @param {object} result API response body
 *
 * @returns {Error} Returns extended `Error` object.
 * @private
 */
function getError(message, status, result) {
  const error = new Error();
  error.message = message;
  error.status = status;
  error.result = result;
  return error;
}

/**
 * Makes a call to the RewardOps API
 *
 * @param {string} httpMethod The name of the HTTP method
 * @param {object} options API request options.
 * @param {string} options.path The relative path to the API endpoint.
 * @param {object} options.config The config object to use in the API request (usually the result of `RO.config.getAll()`).
 * @param {object} [options.params] A params object to send with the API request.
 *   For `GET` requests these are sent as query params. For other requests they are sent as a JSON body.
 * @param {module:api~requestCallback} callback Callback that handles the response
 *
 * @protected
 */
function apiCall(httpMethod, options, callback) {
  if (options.params && isEmpty(options.params)) {
    delete options.params;
  }

  auth.getToken(options.config, (error, token) => {
    const { apiVersion } = options.config;
    const apiBaseUrlOptions = apiVersion ? { apiVersion } : {};
    const url = urls.getApiBaseUrl(apiBaseUrlOptions) + options.path;

    if (error) {
      callback(error);
    } else {
      const requestOptions = {
        method: httpMethod,
        url,
        json: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Some firewalls strip the body of GET requests.
      // To get around this, we send the params for GET
      // requests as query params instead of a JSON body.
      if (httpMethod === 'GET' && options.params) {
        requestOptions.qs = options.params;
      } else if (options.params) {
        requestOptions.body = options.params;
      }

      log(`Request: ${httpMethod} ${url}`);

      // eslint-disable-next-line default-param-last
      request(requestOptions, (err, { statusCode = 500, headers, request: req } = {}, responseBody) => {
        const meta = {
          request: requestOptions,
          response: {
            responseBody,
            statusCode,
            headers,
          },
        };
        if (err) {
          log(err, { meta });

          callback(err, undefined, undefined, req);
        } else if (statusCode === 401) {
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
          log('API Error: {responseBody}', { level: 'error', meta, data: { responseBody } });

          error = getError(responseBody.error, statusCode, responseBody.result);
          callback(error, undefined, undefined, req);
        } else if (responseBody && responseBody.result && responseBody.result.error) {
          log('API Error: {errorDetails}', {
            level: 'error',
            meta,
            data: { errorDetails: responseBody.result.error.detail },
          });

          error = getError(responseBody.result.error.detail, statusCode, responseBody.result);
          callback(error, undefined, undefined, req);
        } else if (['5', '4'].includes(String(statusCode)[0])) {
          /**
           * Handle unexpected errors 5XX or 4XX (i.e. 504: GatewayTimeout)
           */
          log(`API Error: Unknown cause, status ${statusCode}`, { level: 'error', meta });

          error = getError(null, statusCode, null);
          callback(error, undefined, undefined, req);
        } else {
          log(`Success: ${statusCode} ${urls.getApiBaseUrl()}${options.path}`);

          callback(null, responseBody.result, responseBody, req);
        }
      });
    }
  });
}

/**
 * Enum for HTTP methods
 *
 * @enum {string}
 * @private
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
};

/**
 * Container object for API call methods
 *
 * @type {object}
 * @property {module:api~apiCall} get `GET` API call method
 * @property {module:api~apiCall} post `POST` API call method
 * @property {module:api~apiCall} patch `PATCH` API call method
 *
 * @see {@link HTTP_METHODS} for more information
 */
const api = {};

/**
 * Higher order function for generating methods on the {@link api} object.
 *
 * @type {object}
 * @private
 */
const generateApiMethod = httpMethod => (options, callback) => {
  apiCall(httpMethod, options, callback);
};

/*
 * On module initialization, loop through the HTTP methods to
 * populate the {@link api} object.
 */
Object.keys(HTTP_METHODS).forEach(httpMethod => {
  api[httpMethod.toLowerCase()] = generateApiMethod(httpMethod);
});

module.exports = api;

/**
 * Callbacks follow the [Node.js error-first callback pattern]{@link https://nodejs.org/api/errors.html#errors_error_first_callbacks}.
 *
 * @callback module:api~requestCallback
 * @param {(Error|null)} error Either an `Error` object or `null` if there's no error
 * @param {object} responseBody The 'result' object from the API response body
 * @param {object} response The full body of the response from the API. This includes pagination details, if present
 * @param {object} [req] The full request object from the request library.
 */
