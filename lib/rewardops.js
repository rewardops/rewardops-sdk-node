'use strict';

var _ = require('underscore');

/*
 * Return a RewardOps object.
 *
 * @example
 *
 * var ro = rewardOps({
 *   apiKey: 'abcdefgh12345678'
 * });
 *
 * @param {string} options - A config object
 * @param {string} options.apiKey - A RewardOps API key
 *
 * @returns {Object} A RewardOps object
 */

function rewardOps(options) {
  var defaultConfig = require('./config'),
      config        = _.extend({}, defaultConfig, options);

  return {
    config: config,
    version: require('../package').version
  };
}

module.exports = rewardOps;

