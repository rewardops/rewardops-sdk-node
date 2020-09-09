/**
 * Authorization
 *
 * @module auth
 * @copyright 2015–2020 RewardOps Inc.
 */

const request = require('request');

const emitter = require('./emitter');
const urls = require('./urls');
const { generateBasicAuthToken } = require('./utils/auth');

/**
 * Token lock status
 *
 * @private
 */
let tokenLocked = false;

/**
 * URL path for the authorization token in the RewardOps API.
 *
 * @protected
 */
const TOKEN_PATH = '/token';

/**
 * Get status of authorization token lock.
 *
 * @returns {boolean} Returns token lock status
 *
 * @private
 */
const isTokenLocked = () => tokenLocked;

/**
 * Lock authorization token.
 *
 * @private
 */
function lockToken() {
  tokenLocked = true;
}

/**
 * Unlock authorization token.
 *
 * @private
 */
function unlockToken() {
  tokenLocked = false;
}

/**
 * Authorization token properties and actions object.
 *
 * @type {object}
 *
 * @property {{access_token: string, expires: Date}} token The current authorization token (retreived from the API).
 * @property {Function} getBaseUrl Get the base URL for the RewardOps authorization token.
 * @property {Function} getTokenUrl Get the authorization token URL for the RewardOps API.
 * @property {Function} getTokenPath Get the value of `TOKEN_PATH`.
 * @property {Function} invalidateToken Invalidate (clear) the authorization token.
 * @property {getToken} getToken Get authorization token.
 */
const auth = {
  token: {},

  getBaseUrl: () => `${urls.getApiBaseUrl()}/auth`,

  getTokenUrl() {
    return this.getBaseUrl() + TOKEN_PATH;
  },

  getTokenPath() {
    return TOKEN_PATH;
  },
  invalidateToken: () => {
    auth.token = {};
  },
};

/**
 * Safe request authorization token method.
 *
 * If the initial responses have errors, a retry strategy is employed.
 *
 * @async
 *
 * @param {object} requestOptions Options for a [Request]{@link https://github.com/request/request} POST call.
 * @param {{attempts: number, maxAttempts: number}} retryStrategy Request retry strategy options.
 * @param {module:api~requestCallback} callback Callback that handles the response.
 *
 * @protected
 */
function requestToken(requestOptions, retryStrategy, callback) {
  emitter.emit('lockToken');
  emitter.once('unlockToken', callback);

  retryStrategy.attempts += 1;

  request.post(requestOptions, (error, response, body) => {
    if (error && (error.message === 'ETIMEDOUT' || error.message === 'ESOCKETTIMEDOUT')) {
      if (retryStrategy.attempts >= retryStrategy.maxAttempts) {
        /*
         * If the request times out and
         * the max amount of counter.attempts has been
         * reached, pass the error to the callback
         */
        emitter.emit('unlockToken', error);
      } else {
        /*
         * If the request times out
         * and the max number of counter.attempts
         * hasn't been reached, try again
         */
        emitter.removeListener('unlockToken', callback);
        requestToken(requestOptions, retryStrategy, callback);
      }
    } else if (error) {
      /*
       * If there's a programmatic error,
       * fire the callback with the error
       */
      emitter.emit('unlockToken', error);
    } else if (response.statusCode !== 200) {
      if (retryStrategy.attempts >= retryStrategy.maxAttempts) {
        /*
         * If the server returns an error and
         * the max amount of counter.attempts has been
         * reached, create an error and pass
         * it to the callback
         */
        const err = new Error();

        err.name = 'AuthenticationError';
        err.message = '';

        if (response.headers['www-authenticate']) {
          err.message += `${response.headers['www-authenticate'].match(/error_description="(.*)"/)[1]} `;
        }

        err.message += `(error ${response.statusCode})`;

        emitter.emit('unlockToken', err);
      } else {
        /*
         * If the server returns an error
         * and the max number of counter.attempts
         * hasn't been reached, try again
         */
        emitter.removeListener('unlockToken', callback);
        requestToken(requestOptions, retryStrategy, callback);
      }
    } else {
      /*
       * If the server returns a token,
       * set auth.token and fire the
       * callback with the new token
       */
      auth.token = {
        access_token: body.access_token,
        expires: new Date((body.created_at + body.expires_in) * 1000),
      };

      emitter.emit('unlockToken', null, auth.token.access_token);
    }
  });
}

/**
 * Get authorization token.
 *
 * Repeated calls to this function mid-stream are handled gracefully in order
 * to prevent race conditions.
 *
 * @async
 *
 * @param {object} options Options object.
 * @param {string} options.clientId RewardOps API OAuth `client_id`.
 * @param {string} options.clientSecret RewardOps API OAuth `client_secret`.
 * @param {string} [options.timeout] Timeout for HTTP requests (used by [Request]{@link https://github.com/request/request}).
 * @param {module:api~requestCallback} callback Callback that handles the response.
 *
 * @protected
 */
const getToken = (options, callback) => {
  /*
   * Calls to `RO.auth.getToken()` first check whether `RO.auth.tokenLocked()`
   * returns `true`. If it does, the callback passed to `RO.auth.getToken()` is
   * added as a listener to the `newToken` event.
   *
   * If it doesn't return true, call lockToken(),
   * which sets the local variable
   * `tokenLocked` to `true`. (This is read by `RO.auth.tokenLocked()`.
   * Subsequent calls then wait for the new token, per the above.)
   * Then make a call to the oauth2 server for
   * a new token as usual.
   *
   * All of this is to avoid a race condition where mutiple
   * calls for a new token happen at once.
   */
  const retryStrategy = {
    attempts: 0,
    maxAttempts: 3,
  };

  if (!options.clientId || !options.clientSecret) {
    /*
     * Fire the callback with an error if the
     * options doesn't have a clientId and clientSecret
     */
    const error = new Error();

    error.name = 'AuthenticationError';
    error.message = 'You must provide a ';

    if (!options.clientId && !options.clientSecret) {
      error.message += 'clientId and clientSecret';
    } else if (!options.clientId) {
      error.message += 'clientId';
    } else {
      error.message += 'clientSecret';
    }

    callback(error);
  } else if (auth.token && auth.token.access_token && auth.token.expires && auth.token.expires > new Date()) {
    /*
     * If there's already a valid token, use it
     */
    callback(null, auth.token.access_token);
  } else if (isTokenLocked()) {
    emitter.once('unlockToken', callback);
  } else {
    /*
     * Otherwise, request a new token
     */
    const requestOptions = {
      url: auth.getTokenUrl(),
      json: true,
      body: {
        grant_type: 'client_credentials',
      },
      headers: generateBasicAuthToken(options.clientId, options.clientSecret),
    };

    if (options.timeout) {
      requestOptions.timeout = options.timeout;
    }

    requestToken(requestOptions, retryStrategy, callback);
  }
};

auth.getToken = getToken;

emitter.on('invalidateToken', auth.invalidateToken);
emitter.on('lockToken', lockToken);
emitter.on('unlockToken', unlockToken);

module.exports = auth;
