const nock = require('nock');

const RO = require('../../..');
const { generateBasicAuthToken } = require('../../../lib/utils/auth');
const { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN } = require('./credentials');

module.exports = () => {
  // Oauth calls
  nock(RO.auth.getBaseUrl(), {
    reqheaders: generateBasicAuthToken(CLIENT_ID, CLIENT_SECRET),
  })
    .post(RO.auth.getTokenPath(), {
      grant_type: 'client_credentials',
    })
    .times(6)
    .reply(200, {
      created_at: Math.round(+new Date() / 1000),
      expires_in: 7200,
      access_token: ACCESS_TOKEN,
    });
};
