const faker = require('faker');

const { getTestAccessToken } = require('../test-helpers/auth-helpers');

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
