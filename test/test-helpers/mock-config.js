const faker = require('faker');

const { getTestAccessToken } = require('./auth-helpers');

/**
 * Minimal mock {@link module:config~DefaultConfig} object.
 *
 * @private
 */
const minimalMockConfig = {
  clientId: getTestAccessToken(),
  clientSecret: getTestAccessToken(),
};

/**
 * Test helper that returns a complete mock config object.
 *
 * @param {module:config~DefaultConfig} configOverrides Returns a complete config object with overrides and defaults.
 *
 * @returns {module:config~DefaultConfig} Mock config object.
 *
 * @private
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
  quiet = true,
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
  quiet,
});

module.exports = { minimalMockConfig, mockConfig };
