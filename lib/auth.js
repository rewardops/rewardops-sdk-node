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
 * Token lock status for v4 and PII
 *
 * @private
 */
const tokenLockStatus = {
  v4: false,
  pii: false,
};

/**
 * URL path for the authorization token in the RewardOps API.
 *
 * @protected
 */
const TOKEN_PATH = '/token';

/**
 * Get status of authorization token lock.
 *
 * @param {string} tokenId Either `v4` or `pii`
 *
 * @returns {boolean} Returns token lock status
 *
 * @private
 */
const isTokenLocked = tokenId => tokenLockStatus[tokenId];

/**
 * Lock authorization token.
 *
 * @param {string} tokenId Either `v4` or `pii`
 *
 * @private
 */
const lockToken = tokenId => {
  tokenLockStatus[tokenId] = true;
};

/**
 * Unlock authorization token.
 *
 * @param {string} tokenId Either `v4` or `pii`
 *
 * @private
 */
const unlockToken = tokenId => {
  tokenLockStatus[tokenId] = false;
};

/**
 * Authorization token properties and actions object.
 *
 * @type {object}
 *
 * @property {{access_token: string, expires: Date}} token The current authorization token (retrieved from the API).
 * @property {Function} getBaseUrl Get the base URL for the RewardOps authorization token.
 * @property {Function} getTokenUrl Get the authorization token URL for the RewardOps API.
 * @property {Function} getTokenPath Get the value of `TOKEN_PATH`.
 * @property {Function} invalidateToken Invalidate (clear) the authorization token.
 * @property {getToken} getToken Get authorization token.
 */
const auth = {
  tokens: {
    v4: {},
    pii: {},
  },

  /**
   * @type {Function}
   *
   * @param {{ apiVersion: string, apiServerUrl: string }} config Both params are used to build the url
   *
   * @returns {string} Returns the hostname plus the auth path
   */
  getBaseUrl: config => `${urls.getApiBaseUrl(config)}/auth`,

  /**
   * @type {Function}
   *
   * @param {{ apiVersion: string, apiServerUrl: string }} config Both params are used to build the url
   *
   * @returns {string} Returns the complete token url
   */
  getTokenUrl(config) {
    return this.getBaseUrl(config) + TOKEN_PATH;
  },

  getTokenPath() {
    return TOKEN_PATH;
  },

  invalidateToken: tokenId => {
    auth.tokens[tokenId] = {};
  },

  tokenCue: {
    v4: [],
    pii: [],
    addCallback: (tokenId, callback) => {
      auth.tokenCue[tokenId].push(callback);
    },
    handleResolveRequest: tokenId => (...args) => {
      auth.tokenCue[tokenId].forEach(cb => cb(...args));
      auth.tokenCue[tokenId] = [];
    },
  },

  timeoutError: undefined,
};

/**
 * Safe request authorization token method.
 *
 * If the initial responses have errors, a retry strategy is employed.
 *
 * @async
 *
 * @param {string} tokenId Either `v4` or `pii`
 * @param {object} requestOptions Options for a [Request]{@link https://github.com/request/request} POST call.
 * @param {{attempts: number, maxAttempts: number}} retryStrategy Request retry strategy options.
 * @param {module:api~requestCallback} callback Callback that handles the response.
 *
 * @protected
 */
function requestToken(tokenId, requestOptions, retryStrategy, callback) {
  emitter.emit('lockToken', tokenId);
  emitter.once('resolveRequest', callback);
  // emitter.on('unlockToken', unlockToken);

  retryStrategy.attempts += 1;

  request.post(requestOptions, (error, response, body) => {
    if (error && (error.message === 'ETIMEDOUT' || error.message === 'ESOCKETTIMEDOUT')) {
      if (retryStrategy.attempts >= retryStrategy.maxAttempts) {
        /*
         * If the request times out and
         * the max amount of counter.attempts has been
         * reached, pass the error to the callback
         */
        console.log('GOT A TIMEOUT, RESOLVING', error);

        auth.timeoutError = {
          timeStamp: Date.now(),
          error,
        };

        emitter.emit('resolveRequest', error);
        emitter.emit('unlockToken', tokenId);
      } else {
        /*
         * If the request times out
         * and the max number of counter.attempts
         * hasn't been reached, try again
         */
        console.log('GOT A TIMEOUT, RETRY', retryStrategy.attempts);

        emitter.removeListener('resolveRequest', callback);
        requestToken(tokenId, requestOptions, retryStrategy, callback);
      }
    } else if (error) {
      /*
       * If there's a programmatic error,
       * fire the callback with the error
       */
      console.log('UNKNOWN ERROR, RESOLVING', error);

      emitter.emit('resolveRequest', error);
      emitter.emit('unlockToken', tokenId);
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
        console.log('AUTH ERROR, RESOLVING', err);

        emitter.emit('resolveRequest', err);
        emitter.emit('unlockToken', tokenId);
      } else {
        /*
         * If the server returns an error
         * and the max number of counter.attempts
         * hasn't been reached, try again
         */
        console.log('REMOVING LISTENER AND RETRYING');

        emitter.removeListener('resolveRequest', callback);
        requestToken(tokenId, requestOptions, retryStrategy, callback);
      }
    } else {
      /*
       * If the server returns a token,
       * set auth.token and fire the
       * callback with the new token
       */
      auth.tokens[tokenId] = {
        access_token: body.access_token,
        expires: new Date((body.created_at + body.expires_in) * 1000),
      };

      // clear timeout error if present.
      auth.timeoutError = undefined;

      emitter.emit('resolveRequest', null, auth.tokens[tokenId].access_token);
      emitter.emit('unlockToken', tokenId);
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
 * @param {object} config Configuration object used by request function.
 * @param {string} config.clientId RewardOps API OAuth `client_id`.
 * @param {string} config.clientSecret RewardOps API OAuth `client_secret`.
 * @param {string} [config.timeout] Timeout for HTTP requests (used by [Request]{@link https://github.com/request/request}).
 * @param {module:api~requestCallback} callback Callback that handles the response.
 *
 * @protected
 */
const getToken = ({ tokenId = 'v4', test, ...config }, callback) => {
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
   * All of this is to avoid a race condition where multiple
   * calls for a new token happen at once.
   */
  const retryStrategy = {
    attempts: 0,
    maxAttempts: 3,
  };

  if (!config.clientId || !config.clientSecret) {
    /*
     * Fire the callback with an error if the
     * config doesn't have a clientId and clientSecret
     */
    const error = new Error();

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
  } else if (!['v4', 'pii'].includes(tokenId)) {
    /*
     * Fire the callback with an error if the
     * tokenId is not `v4` or `pii`
     */
    const error = new Error();

    error.name = 'ValidationError';
    error.message = 'TokenId must be v4 or pii';

    callback(error);
  } else if (
    auth.tokens[tokenId] &&
    auth.tokens[tokenId].access_token &&
    auth.tokens[tokenId].expires &&
    auth.tokens[tokenId].expires > new Date()
  ) {
    /*
     * If there's already a valid token, use it
     */
    console.log('TOKEN IS VALID, RETURNING TOKEN');
    callback(null, auth.tokens[tokenId].access_token);
  } else if (isTokenLocked(tokenId) && !auth.timeoutError) {
    /*
     * Required for timeout mechanism and race condition
     */
    console.log('TOKEN IS LOCKED, ADDING CB TO QUEUE');

    auth.tokenCue.addCallback(tokenId, callback);

    emitter.once('resolveRequest', auth.tokenCue.handleResolveRequest(tokenId));
  } else {
    /*
     * Otherwise, request a new token
     */
    const requestOptions = {
      url: config.piiServerUrl
        ? auth.getTokenUrl({ apiVersion: 'v5', apiServerUrl: config.piiServerUrl })
        : auth.getTokenUrl(config),
      json: true,
      body: {
        grant_type: 'client_credentials',
      },
      headers: generateBasicAuthToken(config.clientId, config.clientSecret),
    };

    if (config.timeout) {
      requestOptions.timeout = config.timeout;
    }
    if (test === 'foo') {
      console.log('CALLBACK 2, REQUESTING TOKEN');
    }
    requestToken(tokenId, requestOptions, retryStrategy, callback);
  }
};

auth.getToken = getToken;

emitter.on('invalidateToken', auth.invalidateToken);
emitter.on('lockToken', lockToken);
emitter.on('unlockToken', unlockToken);

module.exports = auth;
