const { faker } = require('@faker-js/faker');

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
  piiServerUrl = undefined,
  clientId = getTestAccessToken(),
  clientSecret = getTestAccessToken(),
  logToFile = false,
  timeout = 20000,
  supportedLocales = undefined,
  logFilePath = faker.system.filePath(),
  silent = false,
  verbose = false,
  quiet = false,
} = {}) => ({
  apiServerUrl,
  apiVersion,
  piiServerUrl,
  clientId,
  clientSecret,
  logToFile,
  timeout,
  supportedLocales,
  logFilePath,
  silent,
  verbose,
  quiet,
});

module.exports = { minimalMockConfig, mockConfig };
