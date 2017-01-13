/* Copyright 2015 RewardOps */
'use strict';

var path = require('path');

module.exports = {
  timeout:      20000,
  verbose:      true,
  logToFile:    false,
  logFilePath:  path.resolve(__dirname, '../logs/ro.log')
};

