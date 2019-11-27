/* Copyright 2019 RewardOps */

const winston = require('winston');

/* eslint-disable no-underscore-dangle, operator-linebreak, no-param-reassign */

const config = require('./../config');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => new Date().toISOString(),

      /**
       * Return string will be passed to logger.
       */
      formatter: options =>
        `RewardOps SDK ${options.level.toUpperCase()} ` +
        `[${options.timestamp()}] ${undefined !== options.message ? options.message : ''}${
          options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''
        }`,
    }),
  ],
});

let hasFileLogger = false;

function _addFileLogger() {
  let error;

  if (config.get('logFilePath')) {
    logger.add(winston.transports.File, {
      filename: config.get('logFilePath'),
      maxsize: 100000,
      maxFiles: 20,
    });

    hasFileLogger = true;
  } else {
    error = new Error();

    error.message = 'You must set `logFilePath` in the config before calling `setLogFilePath`';

    throw error;
  }
}

function _removeFileLogger() {
  logger.remove(winston.transports.File);

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
    config.set('logFilePath', path);
  }

  _changeFileLogger();
}

/**
 * If the config option `verbose` is `true` and node environment
 * is not `test`, log the message. Otherwise, do nothing.
 */
function log(message, level) {
  let error;

  // If an Error object is passed as the message,
  // log the error's message and stack trace.
  if (message instanceof Error) {
    error = message;

    message = `${error.message}\n${error.stack}`;

    level = level || 'error';
  } else {
    level = level || 'info';
  }

  if (config.get('verbose') && process.env.NODE_ENV !== 'test') {
    return logger.log(level, message);
  }

  return null;
}

if (config.get('logToFile')) {
  setLogFilePath();
}

module.exports.log = log;
module.exports.setLogFilePath = setLogFilePath;
