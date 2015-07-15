/* Copyright 2015 RewardOps */
'use strict';

var winston         = require('winston'),
    config          = require('./../config'),
    hasFileLogger   = false;

function _addFileLogger() {
  var error;

  if (config.logFilePath) {
    winston.add(winston.transports.File, { filename: config.logFilePath, maxsize: 100000, maxFiles: 20 });

    hasFileLogger = true;
  } else {
    error = new Error();

    error.message = 'You must set `config.logFilePath` before calling `setLogFilePath`';

    throw error;
  }
}

function _removeFileLogger() {
  winston.remove(winston.transports.File);

  hasFileLogger = false;
}

function _changeFileLogger() {
  if (hasFileLogger) {
    _removeFileLogger();
  }

  _addFileLogger();
}

function setLogFilePath(path) {
  if (path) {
    config.logFilePath = path;
  }

  _changeFileLogger();
}

// If the config option `verbose` is `true`,
// log the message. Otherwise, do nothing.
function log(message, level) {
  var now = new Date(),
      error;

  // If an Error object is passed as the message,
  // log the error's message and stack trace.
  if (message instanceof Error) {
    error = message;

    message = error.message + '\n' + error.stack;

    level = level || 'error';
  } else {
    level = level || 'info';
  }

  if (config.verbose) {
    return winston.log(level, '[' + now.toISOString() + '] ' + message);
  }
}

if (config.logToFile) {
  setLogFilePath();
}

module.exports.log            = log;
module.exports.setLogFilePath = setLogFilePath;

