/* Copyright 2015 RewardOps */
'use strict';

var winston = require('winston'),
    config  = require('./../config');

if (config.logToFile) {
  winston.add(winston.transports.File, { filename: config.logFilePath });
}

// If the config option `verbose` is `true`,
// log the message. Otherwise, do nothing.
function logger(message) {
  var now = new Date();

  if (config.verbose) {
    return winston.log('info', '[' + now.toISOString() + '] ' + message);
  }
}

module.exports = logger;

