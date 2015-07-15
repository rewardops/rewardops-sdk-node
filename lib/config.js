/* Copyright 2015 RewardOps */
'use strict';

var path = require('path'),
    defaultConfig;

/**
 * Default configuration
 *
 * @type {object}
 */

defaultConfig = {
  timeout:      20000,
  verbose:      true,
  logToFile:    false,
  logFilePath:  path.resolve(__dirname, '../logs/ro.log')
};

module.exports = defaultConfig;

