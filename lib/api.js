/**
 * API
 * @module api
 * @copyright 2015–2020 RewardOps Inc.
 */

const axios = require('axios');
const { isEmpty } = require('lodash');

const auth = require('./auth');
const emitter = require('./emitter');
const urls = require('./urls');
const { log } = require('./utils/logger');

/**
 * Generate extended `Error` object with `message`, `status`, and `result` properties.
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
 * Build a request-like object for compatibility with tests and callbacks
 * @param {object} axiosConfig The axios configuration object
 *
 * @returns {object} Returns an object with { headers, method, uri } properties
 * @private
 */
function buildRequestObj(axiosConfig) {
  // Use axios.getUri() to get the final URL with properly serialized params
  const requestUri = new URL(axios.getUri(axiosConfig));
  return {
    headers: axiosConfig.headers,
    method: axiosConfig.method,
    uri: requestUri, // URL object for test compatibility
  };
}

/**
 * Makes a call to the RewardOps API
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
      log(`Request: ${httpMethod} ${url}`);

      // Convert request options to axios format
      const axiosConfig = {
        method: httpMethod,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true, // Don't reject on any status code, handle all statuses in .then()
      };

      // Handle query params and body
      if (httpMethod === 'GET' && options.params) {
        axiosConfig.params = options.params;
      } else if (options.params) {
        axiosConfig.data = options.params;
      }

      axios(axiosConfig)
        .then((response) => {
          const { status: statusCode, headers, data: responseBody } = response;
          const meta = {
            request: axiosConfig,
            response: {
              responseBody,
              statusCode,
              headers,
            },
          };

          // Create a request-like object for compatibility with tests
          const requestObj = buildRequestObj(axiosConfig);

          if (statusCode === 401) {
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
            callback(error, undefined, undefined, requestObj);
          } else if (responseBody && responseBody.result && responseBody.result.error) {
            log('API Error: {errorDetails}', {
              level: 'error',
              meta,
              data: { errorDetails: responseBody.result.error.detail },
            });

            error = getError(responseBody.result.error.detail, statusCode, responseBody.result);
            callback(error, undefined, undefined, requestObj);
          } else if (['5', '4'].includes(String(statusCode)[0])) {
            /**
             * Handle unexpected errors 5XX or 4XX (i.e. 504: GatewayTimeout)
             */
            log(`API Error: Unknown cause, status ${statusCode}`, { level: 'error', meta });

            error = getError(null, statusCode, null);
            callback(error, undefined, undefined, requestObj);
          } else {
            log(`Success: ${statusCode} ${url}`);

            callback(null, responseBody.result, responseBody, requestObj);
          }
        })
        .catch((err) => {
          const meta = {
            request: axiosConfig,
            response: {
              responseBody: err.response && err.response.data,
              statusCode: (err.response && err.response.status) || 500,
              headers: err.response && err.response.headers,
            },
          };
          log(err, { meta });

          const requestObj = buildRequestObj(axiosConfig);
          callback(err, undefined, undefined, requestObj);
        });
    }
  });
}

/**
 * Enum for HTTP methods
 * @enum {string}
 * @private
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Container object for API call methods
 * @type {object}
 * @property {module:api~apiCall} get `GET` API call method
 * @property {module:api~apiCall} post `POST` API call method
 * @property {module:api~apiCall} patch `PATCH` API call method
 * @property {module:api~apiCall} delete `DELETE` API call method
 *
 * @see {@link HTTP_METHODS} for more information
 */
const api = {};

/**
 * Higher order function for generating methods on the {@link api} object.
 * @type {object}
 * @private
 */
const generateApiMethod = (httpMethod) => (options, callback) => {
  apiCall(httpMethod, options, callback);
};

/*
 * On module initialization, loop through the HTTP methods to
 * populate the {@link api} object.
 */
Object.keys(HTTP_METHODS).forEach((httpMethod) => {
  api[httpMethod.toLowerCase()] = generateApiMethod(httpMethod);
});

module.exports = api;

/**
 * Callbacks follow the [Node.js error-first callback pattern]{@link https://nodejs.org/api/errors.html#errors_error_first_callbacks}.
 * @callback module:api~requestCallback
 * @param {(Error|null)} error Either an `Error` object or `null` if there's no error
 * @param {object} responseBody The 'result' object from the API response body
 * @param {object} response The full body of the response from the API. This includes pagination details, if present
 * @param {object} [req] The full request object from the request library.
 */
