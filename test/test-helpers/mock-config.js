const faker = require('faker');

const { getTestAccessToken } = require('./auth-helpers');

/**
 * Test helper that returns a mock config object.
 *
 *
 * @param {{apiServerUrl: string, apiVersion: string, piiServerUrl: string, clientId: string, clientSecret: string, logToFile: boolean, timeout: number, verbose: boolean, supportedLocales: Array|undefined}} configOverrides Returns a complete config object with overrides and defaults.
 * @returns {object} Mock config object for tests.
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
  logFilePath = faker.system.filePath(),
} = {}) => ({
  apiServerUrl,
  apiVersion,
  piiServerUrl,
  clientId,
  clientSecret,
  logToFile,
  timeout,
  verbose,
  supportedLocales,
  logFilePath,
});

module.exports = { mockConfig };
