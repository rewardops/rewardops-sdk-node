/**
 * Logging helper
 *
 * we use the winston library to simplify logging
 * see: https://github.com/winstonjs/winston for API docs
 *
 * @module utils/logger
 * @copyright 2015–2020 RewardOps Inc.
 */

const winston = require('winston');
const { isEmpty } = require('lodash');

const config = require('./../config');

const { combine, timestamp: timestampFormatter, printf } = winston.format;

/**
 * Pretty print a JSON object
 *
 * @param {object|Array} json JSON object
 *
 * @returns {string} Prettier JSON string
 *
 * @protected
 */
const prettyPrint = json => JSON.stringify(json, undefined, 2);

/**
 * Get Winston log level based on SDK configuration.
 *
 * @returns {string} Log level
 *
 * @private
 */
const getLogLevel = () => {
  if (config.get('verbose')) {
    return 'verbose';
  }
  if (config.get('quiet')) {
    return 'warn';
  }
  return 'info';
};

/** RewardOps log format */
const loggerFormatter = printf(({ level, message = '', timestamp, meta = {} }) => {
  return [
    `RewardOps SDK ${level.toUpperCase()}`,
    `[${timestamp}] ${message}`,
    isEmpty(meta) ? '' : `\n\t${prettyPrint(meta)}`,
  ].join('');
});

/**
 * Winston logger configuration
 *
 * @type {winston.Logger}
 * @private
 */
const logger = winston.createLogger({
  format: combine(timestampFormatter(), loggerFormatter),
  transports: [new winston.transports.Console({ level: getLogLevel() })],
});

/**
 * Whether the file logger is enabled.
 *
 * @type {boolean}
 * @private
 */
let isFileLoggerEnabled = false;

/**
 * If `logFilePath` is set on {@link module:config}, set log messages to be added to a file.
 *
 * @throws Will throw is `logFilePath` not set
 * @private
 */
const addFileLogger = () => {
  if (config.get('logFilePath')) {
    logger.add(
      new winston.transports.File({
        level: getLogLevel(),
        filename: config.get('logFilePath'),
        maxsize: 100000,
        maxFiles: 20,
      })
    );

    isFileLoggerEnabled = true;
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

  isFileLoggerEnabled = false;
};

/**
 * Toggle log-to-file configuration for `logger`.
 *
 * @see {@link logger} for more information.
 * @private
 */
const toggleFileLogger = () => {
  if (isFileLoggerEnabled) {
    removeFileLogger();
  }
  addFileLogger();
};

/**
 * Sets the path for the log file and enable file logging.
 *
 * NOTE: Runs on module initialization.
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
 * @param {string} message Log message
 * @param {object} options Options object
 * @param {string} options.level Log level
 * @param {object} options.meta Optional log metadata
 *
 * @returns {winston.log|null} Returns a log message if the {@link module:config} option `verbose` is `true`;
 * otherwise, returns `null`.
 */
function log(message, { level = 'info', meta = {} } = {}) {
  if (config.get('quiet')) {
    // if quiet is true, do not log anything.
    return null;
  }

  if (message instanceof Error) {
    const error = message;
    message = `${error.message}\n${error.stack}`;
    level = 'error';
  }

  return logger.log(level, `${message}${config.get('verbose') && !isEmpty(meta) ? `\n\t${prettyPrint(meta)}` : ''}`);
}

if (config.get('logToFile')) {
  setLogFilePath();
}

module.exports = { log, setLogFilePath, prettyPrint };
