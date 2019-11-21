/* Copyright 2019 RewardOps */

const request = require('request');

const emitter = require('./emitter');
const urls = require('./urls');

let tokenIsLocked = false;

const auth = {
  tokenPath: '/token',
  token: {},

  getBaseUrl: () => `${urls.apiBaseUrl()}/auth`,

  getTokenUrl() {
    return this.getBaseUrl() + this.tokenPath;
  },

  getTokenPath() {
    return this.tokenPath;
  },
};

function requestToken(options, counter, callback) {
  emitter.emit('lockToken');
  emitter.once('unlockToken', callback);

  counter.attempts += 1;

  request.post(options, (error, response, body) => {
    if (error && (error.message === 'ETIMEDOUT' || error.message === 'ESOCKETTIMEDOUT')) {
      if (counter.attempts >= counter.maxAttempts) {
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
        requestToken(options, counter, callback);
      }
    } else if (error) {
      /*
       * If there's a programmatic error,
       * fire the callback with the error
       */
      emitter.emit('unlockToken', error);
    } else if (response.statusCode !== 200) {
      if (counter.attempts >= counter.maxAttempts) {
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
          err.message += `${
            response.headers['www-authenticate'].match(/error_description="(.*)"/)[1]
          } `;
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
        requestToken(options, counter, callback);
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

function tokenLocked() {
  return tokenIsLocked;
}

function lockToken() {
  tokenIsLocked = true;
}

function unlockToken() {
  tokenIsLocked = false;
}

auth.getToken = (options, callback) => {
  /*
   * Calls to RO.auth.getToken() first check whether RO.auth.tokenLocked()
   * returns `true`. If it does, the callback passed to RO.auth.getToken() is
   * added as a listener to the 'newToken' event.
   *
   * If it doesn't return true, call lockToken(),
   * which sets the local variable
   * `tokenLocked` to true. (This is read by RO.auth.tokenLocked().
   * Subsequent calls then wait for the new token, per the above.)
   * Then make a call to the oauth2 server for
   * a new token as usual.
   *
   * All of this is to avoid a race condition where mutiple
   * calls for a new token happen at once.
   */
  const counter = {
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
  } else if (
    auth.token &&
    auth.token.access_token &&
    auth.token.expires &&
    auth.token.expires > new Date()
  ) {
    /*
     * If there's already a valid token, use it
     */
    callback(null, auth.token.access_token);
  } else if (tokenLocked()) {
    emitter.once('unlockToken', callback);
  } else {
    /*
     * Otherwise, request a new token
     */
    const opts = {
      url: auth.getTokenUrl(),
      json: true,
      body: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${options.clientId}:${options.clientSecret}`).toString(
          'base64'
        )}`,
      },
    };

    if (options.timeout) {
      opts.timeout = options.timeout;
    }

    requestToken(opts, counter, callback);
  }
};

auth.invalidateToken = () => {
  auth.token = {};
};

emitter.on('invalidateToken', auth.invalidateToken);
emitter.on('lockToken', lockToken);
emitter.on('unlockToken', unlockToken);

module.exports = auth;
