/**
 * Axios helpers
 *
 * @module utils/axios
 * @copyright 2015–2020 RewardOps Inc.
 */
const axios = require('axios');

const auth = require('../auth');
const config = require('../config');

/**
 * Set axios' default auth header to OAuth Bearer Token from v5 RO API
 *
 * @async
 *
 * @param {axios.AxiosInstance<void>} client Avoids polluting the global axios object.
 * @returns {Promise<void>} If an error is returned from `auth.getToken` the
 * promise will reject, otherwise it will resolve.
 *
 * @example
 * await setPiiToken()
 *
 * @protected
 */
const setPiiToken = client =>
  new Promise((resolve, reject) => {
    auth.getToken(
      { ...config.getAll(), apiVersion: 'v5', apiServerUrl: config.get('piiServerUrl') },
      (error, token) => {
        if (error) {
          reject(error.toString());
        }

        client.defaults.headers.common.Authorization = `Bearer ${token}`;
        resolve();
      }
    );
  });

module.exports = { setPiiToken };
