/**
 * Logging helper
 *
 * @module utils/logger
 * @license
 * Copyright 2019 RewardOps Inc.
 */

const winston = require('winston');

const config = require('./../config');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => new Date().toISOString(),

      formatter: options =>
        `RewardOps SDK ${options.level.toUpperCase()} ` +
        `[${options.timestamp()}] ${undefined !== options.message ? options.message : ''}${
          options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''
        }`,
    }),
  ],
});

let hasFileLogger = false;

function addFileLogger() {
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

function removeFileLogger() {
  logger.remove(winston.transports.File);

  hasFileLogger = false;
}

function changeFileLogger() {
  if (hasFileLogger) {
    removeFileLogger();
  }

  addFileLogger();
}

/**
 * Configure (set) the file path of the log output.
 *
 * @param {string} path Log file path
 */
function setLogFilePath(path) {
  if (path) {
    config.set('logFilePath', path);
  }

  changeFileLogger();
}

/**
 * Log a message to console
 *
 * NOTE: If the config option `verbose` is `true` and node environment (`NODE_ENV`)
 * is not `test`, log the message; otherwise, do nothing.
 *
 * @param {string} message Log message
 * @param {string} level Log level
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

  if (config.get('verbose')) {
    return logger.log(level, message);
  }

  return null;
}

if (config.get('logToFile')) {
  setLogFilePath();
}

module.exports = { log, setLogFilePath };
