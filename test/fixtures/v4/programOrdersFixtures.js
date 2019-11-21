const nock = require('nock');

module.exports = function() {
  // Oauth calls
  nock('https://app.rewardops.net/api/v4/auth', {
    reqheaders: {
      Authorization: `Basic ${Buffer.from('programTest123:itsATestGetUsedToIt').toString(
        'base64'
      )}`,
    },
  })
    .post('/token', {
      grant_type: 'client_credentials',
    })
    .times(1)
    .reply(200, {
      created_at: Math.round(+new Date() / 1000),
      expires_in: 7200,
      access_token: 'abcd1234rewardTime',
    });
};
