/**
 * Generate `Basic`-type header authorization token for RewardOps API
 *
 * @param {string} clientId RewardOps API client ID
 * @param {string} clientSecret RewardOps API client secret
 * @returns Object with `Basic`-type `Authorization` header property
 */
const generateBasicAuthToken = (clientId, clientSecret) => ({
  Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
});

module.exports = { generateBasicAuthToken };
