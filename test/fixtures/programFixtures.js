'use strict';

var nock  = require('nock'),
    RO    = require('../..');

module.exports = function() {
  // Oauth calls
  nock(RO.auth.baseUrl)
    .post(RO.auth.tokenPath, {
        'grant_type': 'client_credentials',
        'client_id': 'programTest123',
        'client_secret': 'itsATestGetUsedToIt'
      })
    .times(6)
    .reply(200, {
      'created_at': Math.round(+new Date()/1000),
      'expires_in': 7200,
      'access_token': 'abcd1234programTime'
    });
};

