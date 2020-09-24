const axios = require('axios');

const auth = require('../auth');
const config = require('../config');

/**
 * Set axios' default auth header to OAuth Bearer Token from v5 RO API
 *
 * @async
 * @returns {Promise} If an error is returned from `auth.getToken` the
 * promise will reject, otherwise it will resolve.
 *
 * @example
 * await setPiiToken()
 *
 * @protected
 */
const setPiiToken = () =>
  new Promise((resolve, reject) => {
    auth.getToken(
      { ...config.getAll(), apiVersion: 'v5', apiServerUrl: config.get('piiServerUrl') },
      (error, token) => {
        if (error) {
          reject(error.toString());
        }

        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        resolve();
      }
    );
  });

module.exports = { setPiiToken };
