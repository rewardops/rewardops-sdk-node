const { faker } = require('@faker-js/faker');

/**
 * Since OAuth Bearer tokens don't have a defined structure, we will
 * generate alphanumeric strings of length 24.
 *
 * @see {@link https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/ OAuth access tokens}
 *
 * @returns {string} testAccessToken
 *
 * @example
 * getTestAccessToken() // => mjpyxya9signd3g9zu1s1zkb
 */
const getTestAccessToken = () => faker.random.alphaNumeric(24);

module.exports = { getTestAccessToken };
