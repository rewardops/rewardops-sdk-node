/* Copyright 2019 RewardOps */
'use strict';

var programs = require('./resources/programs');

/*
 * The RewardOps namespace
 */

var RO = {
  api:            require('./api'),
  auth:           require('./auth'),
  config:         require('./config'),
  emitter:        require('./emitter'),
  program:        programs.program,
  programs:       programs.programs,
  setLogFilePath: require('./utils/logger').setLogFilePath,
  urls:           require('./urls'),
  version:        require('../package').version
};

module.exports = RO;

