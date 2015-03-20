/* Copyright 2015 RewardOps */
'use strict';

var request       = require('request'),
    emitter       = require('./emitter'),
    urls          = require('./urls'),
    tokenPath     = '/token',
    tokenIsLocked = false;

function getToken(config, callback) {
  /* jshint camelcase: false */

  /*
   * Calls to RO.auth.getToken() first check whether RO.auth.tokenLocked()
   * returns `true`. If it does, the callback passed to RO.auth.getToken() is
   * added as a listener to the 'newToken' event.
   *
   * If it doesn't return true, call lockToken(),
   * which sets the local var
   * `tokenLocked` to true. (This is read by RO.auth.tokenLocked().
   * Subsequent calls then wait for the new token, per the above.)
   * Then make a call to the oauth2 server for
   * a new token as usual.
   *
   * All of this is to avoid a race condition where mutiple
   * calls for a new token happen at once, making all but
   * the last return immediately invalidated tokens.
   */
  var attempts    = 0,
      maxAttempts = 3;

  function requestToken(options) {
    emitter.emit('lockToken');
    emitter.once('unlockToken', callback);

    attempts++;

    request.post(options, function(error, response, body) {
      if (error && (error.message === 'ETIMEDOUT')) {
        if (attempts >= maxAttempts) {
          /*
           * If the request times out and
           * the max amount of attempts has been
           * reached, pass the error to the callback
           */
          emitter.emit('unlockToken', error);
        } else {
          /*
           * If the request times out
           * and the max number of attempts
           * hasn't been reached, try again
           */
          emitter.removeListener('unlockToken', callback);
          requestToken(options);
        }
      } else if (error) {
        /*
         * If there's a programmatic error,
         * fire the callback with the error
         */
        emitter.emit('unlockToken', error);
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

          emitter.emit('unlockToken', err);
        } else {
          /*
           * If the server returns an error
           * and the max number of attempts
           * hasn't been reached, try again
           */
          emitter.removeListener('unlockToken', callback);
          requestToken(options);
        }
      } else {
        /*
         * If the server returns a token,
         * set auth.token and fire the
         * callback with the new token
         */
        auth.token = {
          access_token: body.access_token,
          expires: new Date((body.created_at + body.expires_in) * 1000)
        };

        emitter.emit('unlockToken', null, auth.token.access_token);
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
  } else if (tokenLocked()) {
    emitter.once('unlockToken', callback);
  } else {
    /*
     * Otherwise, request a new token
     */
    var options = {
      url: auth.getTokenUrl(),
      json: true,
      body: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64')
      }
    };

    if (config.timeout) {
      options.timeout = config.timeout;
    }

    requestToken(options);
  }
}

function invalidateToken() {
  auth.token = {};
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

function getBaseUrl() {
return urls.getBaseUrl() + '/auth';
}

function getTokenPath() {
  return tokenPath;
}

function getTokenUrl() {
  return getBaseUrl() + tokenPath;
}

emitter.on('invalidateToken', invalidateToken);
emitter.on('lockToken', lockToken);
emitter.on('unlockToken', unlockToken);

var auth = {
  getBaseUrl: getBaseUrl,
  getTokenUrl: getTokenUrl,
  getTokenPath: getTokenPath,
  token: {},
  getToken: getToken,
  invalidateToken: invalidateToken
};

module.exports = auth;

