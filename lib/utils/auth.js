/**
 * Authorization helpers
 *
 * @module utils/auth
 * @copyright 2015–2020 RewardOps Inc.
 */

const axios = require('axios');
const { add } = require('lodash');

const config = require('../config');

/**
 * Generate `Basic`-type header authorization token for RewardOps API
 *
 * @param {string} clientId RewardOps API client ID
 * @param {string} clientSecret RewardOps API client secret
 * @returns {object} Object with `Basic`-type `Authorization` header property
 *
 * @example
 * generateBasicAuthToken('abc123', 'xyz987')
 * // => { Authorization: 'Basic YWJjMTIzOnh5ejk4Nw==' }
 */
const generateBasicAuthToken = (clientId, clientSecret) => ({
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
});

const getV5Token = async () =>
  axios.post(
    `${config.get('piiServerUrl')}/api/v5/auth/token`,
    {
      grant_type: 'client_credentials',
    },
    {
      auth: {
        username: config.get('clientId'),
        password: config.get('clientSecret'),
      },
    }
  );
// give a 10 second buffer for any network latency i.e. CA => AU
const TOKEN_EXPIRATION_BUFFER = 10000;

const setAxiosTokenData = (axiosInstance, { expires_in: expiresIn, created_at: createdAt }) => {
  const expiresAt = add(createdAt, expiresIn * 1000 - TOKEN_EXPIRATION_BUFFER);

  axiosInstance.defaults.tokenData = { expiresIn, createdAt, expiresAt };
};

const isTokenValid = dateObj => axios.defaults.tokenData.expiresAt > dateObj.now();

const setV5Token = async (dateObj = Date) => {
  if (isTokenValid(dateObj)) {
    return;
  }

  const { data } = await getV5Token();

  setAxiosTokenData(axios, data);

  axios.defaults.headers.common.Authorization = `Bearer ${data.access_token}`;
};

module.exports = { generateBasicAuthToken, setV5Token };
