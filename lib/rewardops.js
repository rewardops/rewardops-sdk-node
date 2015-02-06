/* Copyright 2015 RewardOps */
'use strict';

var mixin = require('./utils/mixin');

/*
 * The RewardOps namespace
 */

var RO = {
  config: mixin({}, require('./config')),
  version: require('../package').version,
  api: require('./api'),
  auth: require('./auth'),
  program: require('./program'),
  programs: require('./resources/programs')
};

module.exports = RO;

