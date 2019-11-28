const nock = require('nock');

const RO = require('../..');
const { generateBasicAuthToken } = require('../../lib/utils/auth');

module.exports = () => {
  nock(RO.auth.getBaseUrl(), {
    reqheaders: generateBasicAuthToken('abcdefg1234567', 'abcdefg1234567'),
  })
    .post('/token', {
      grant_type: 'client_credentials',
    })
    .twice()
    .reply(200, {
      access_token: 'abcdefg1234',
      token_type: 'bearer',
      expires_in: 7200,
      created_at: Math.round(+new Date() / 1000),
    });

  nock(RO.urls.apiBaseUrl(), {
    reqheaders: {
      Authorization: 'Bearer abcdefg1234',
    },
  })
    .get('/someTestPath')
    .twice()
    .reply(200, {
      status: 'OK',
      result: [
        {
          id: 2,
          active: true,
          name: 'SaveUp',
          description:
            'Get rewarded for your savings, not your spending. A revolutionary free rewards program to help people save money and get out of debt.',
          url: 'https://www.saveup.com',
          network_commission: null,
          currency_name: 'Stamps',
          image_url:
            'http://s3.amazonaws.com/rewardops_development/programs/logos/000/000/002/normal/SaveUp_Logo.png?1413933704',
          created_at: '2014-04-01T14:53:09.000Z',
          updated_at: '2014-10-21T23:21:49.000Z',
        },
      ],
      pagination: {
        previous: null,
        next: null,
        current: 1,
        per_page_count: 10,
        count: 1,
        pages: 1,
      },
    });
};
