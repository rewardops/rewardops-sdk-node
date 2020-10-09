const nock = require('nock');

const RO = require('../../..');
const { generateBasicAuthToken } = require('../../../lib/utils/auth');

module.exports = () => {
  // Oauth calls
  nock(RO.auth.getBaseUrl(), {
    reqheaders: generateBasicAuthToken('programTest123', 'itsATestGetUsedToIt'),
  })
    .post('/token', {
      grant_type: 'client_credentials',
    })
    .times(6)
    .reply(200, {
      created_at: Math.round(+new Date() / 1000),
      expires_in: 7200,
      access_token: 'abcd1234rewardTime',
    });
};
