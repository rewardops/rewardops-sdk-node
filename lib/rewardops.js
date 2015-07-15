/* Copyright 2015 RewardOps */
'use strict';

/*
 * The RewardOps namespace
 */

var RO = {
  config: require('./config'),
  version: require('../package').version,
  api: require('./api'),
  auth: require('./auth'),
  emitter: require('./emitter'),
  program: require('./program'),
  programs: require('./resources/programs'),
  setLogFilePath: require('./utils/logger').setLogFilePath,
  urls: require('./urls')
};

module.exports = RO;

