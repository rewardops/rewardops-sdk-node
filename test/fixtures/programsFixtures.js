'use strict';

var nock  = require('nock'),
    auth  = require('../../lib/auth'),
    api   = require('../../lib/api');

module.exports = function() {
  // Oauth calls
  nock(auth.baseUrl)
    .post(auth.oauthPath)
    .times(4)
    .reply(200, {
      'status':'OK',
      'result': {
        'token': 'abcd1234'
      }
    });

  // API calls
  nock(api.baseUrl)
    .get('/programs')
    .reply(200, {
      "status":"OK","result":[{"id":2,"active":true,"name":"SaveUp","description":"Get rewarded for your savings, not your spending. A revolutionary free rewards program to help people save money and get out of debt.","url":"https://www.saveup.com","network_commission":null,"currency_name":"Stamps","image_url":"http://s3.amazonaws.com/rewardops_development/programs/logos/000/000/002/normal/SaveUp_Logo.png?1413933704","created_at":"2014-04-01T14:53:09.000Z","updated_at":"2014-10-21T23:21:49.000Z"}],"pagination":{"previous":null,"next":null,"current":1,"per_page_count":10,"count":1,"pages":1} // jshint ignore:line
    });
};

