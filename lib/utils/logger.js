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

/**
 * If `logFilePath` is set on `config`, set log messages to be added to a file.
 *
 * @throws Will throw is `logFilePath` not set
 * @see {@link config} for more information.
 * @private
 */
const addFileLogger = () => {
  if (config.get('logFilePath')) {
    logger.add(winston.transports.File, {
      filename: config.get('logFilePath'),
      maxsize: 100000,
      maxFiles: 20,
    });

    hasFileLogger = true;
  } else {
    throw Error('You must set `logFilePath` in the config before calling `setLogFilePath`');
  }
};

/**
 * Remove log-to-file configuration for `logger`.
 *
 * @see {@link logger} for more information.
 * @private
 */
const removeFileLogger = () => {
  logger.remove(winston.transports.File);

  hasFileLogger = false;
};

/**
 * Toggle log-to-file configuration for `logger`.
 *
 * @see {@link logger} for more information.
 * @private
 */
const toggleFileLogger = () => (hasFileLogger ? removeFileLogger() : addFileLogger());

/**
 * Configure (set) the file path of the log output. Runs automatically.
 *
 * @param {string} path Log file path
 */
function setLogFilePath(path) {
  if (path) {
    config.set('logFilePath', path);
  }

  toggleFileLogger();
}

/**
 * Log a message to console.
 *
 * If an Error object is passed as the message, it will log both the error's
 * message and stack trace.
 *
 * NOTE: Will only return a log message if the `config` option `verbose` is `true`;
 * otherwise, it will return nothing.
 *
 * @param {string} message Log message
 * @param {string} level Log level
 */
function log(message, level) {
  if (message instanceof Error) {
    const error = message;

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
