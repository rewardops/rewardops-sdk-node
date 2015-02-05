/* Copyright 2015 RewardOps */
'use strict';

var request = require('request');

var api = {
  baseUrl: 'https://app.rewardops.net/api/v3',
  get: function(urlFragment, callback) {
    var url = api.baseUrl + urlFragment;

    request.get({url: url, json: true}, function(error, response, body) {
      if (error) {
        callback(error);
      } else {
        callback(null, body.result, body);
      }
    });
  }
};

module.exports = api;

