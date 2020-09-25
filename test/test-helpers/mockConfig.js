const faker = require('faker');

const { getTestAccessToken } = require('../test-helpers/auth-helpers');

/**
 * Test helper that returns a mock config object.
 *
 *
 * @param {{apiServerUrl: string, apiVersion: string, piiServerUrl: string, clientId: string, clientSecret: string, logToFile: boolean, timeout: number, verbose: boolean, supportedLocales: Array|undefined}} configOverrides Request retry strategy options.
 * @returns {module:api~requestCallback} callback Callback that handles the response.
 *
 * @protected
 */
const mockConfig = ({
  apiServerUrl = faker.internet.url(),
  apiVersion = 'v4',
  piiServerUrl = faker.internet.url(),
  clientId = getTestAccessToken(),
  clientSecret = getTestAccessToken(),
  logToFile = false,
  timeout = 20000,
  verbose = true,
  supportedLocales = undefined,
}) => ({
  apiServerUrl,
  apiVersion,
  piiServerUrl,
  clientId,
  clientSecret,
  logToFile,
  timeout,
  verbose,
  supportedLocales,
});

module.exports = { mockConfig };
