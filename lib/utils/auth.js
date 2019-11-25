/**
 * Authorization helpers
 *
 * @module utils/auth
 * @copyright 2015–2019 RewardOps Inc.
 */

/**
 * Generate `Basic`-type header authorization token for RewardOps API
 *
 * @param {string} clientId RewardOps API client ID
 * @param {string} clientSecret RewardOps API client secret
 * @returns {Object} Object with `Basic`-type `Authorization` header property
 *
 * @example
 * generateBasicAuthToken('abc123', 'xyz987')
 * // => { Authorization: 'Basic YWJjMTIzOnh5ejk4Nw==' }
 */
const generateBasicAuthToken = (clientId, clientSecret) => ({
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
});

module.exports = { generateBasicAuthToken };
