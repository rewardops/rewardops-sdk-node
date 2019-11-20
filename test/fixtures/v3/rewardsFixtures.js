const nock = require('nock');
const RO = require('../../..');

module.exports = function() {
  // Oauth calls
  nock('https://app.rewardops.net/api/v3/auth', {
    reqheaders: {
      Authorization: `Basic ${Buffer.from('rewardTest123:itsATestGetUsedToIt').toString('base64')}`,
    },
  })
    .post(RO.auth.getTokenPath(), {
      grant_type: 'client_credentials',
    })
    .times(6)
    .reply(200, {
      created_at: Math.round(+new Date() / 1000),
      expires_in: 7200,
      access_token: 'abcd1234rewardTime',
    });

  //  // API calls
  //    nock(RO.urls.apiBaseUrl(), {
  //      reqHeaders: {
  //        'Authorization': 'Bearer abcd1234programs'
  //      }
  //    })
  //    .get('/programs')
  //    .reply(200, {
  //      "status":"OK","result":[{"id":2,"active":true,"name":"SaveUp","description":"Get rewarded for your savings, not your spending. A revolutionary free rewards program to help people save money and get out of debt.","url":"https://www.saveup.com","network_commission":null,"currency_name":"Stamps","image_url":"http://s3.amazonaws.com/rewardops_development/programs/logos/000/000/002/normal/SaveUp_Logo.png?1413933704","created_at":"2014-04-01T14:53:09.000Z","updated_at":"2014-10-21T23:21:49.000Z"}],"pagination":{"previous":null,"next":null,"current":1,"per_page_count":10,"count":1,"pages":1}
  //    })
  //    .get('/programs/555')
  //    .reply(200, {result: {}});
};
