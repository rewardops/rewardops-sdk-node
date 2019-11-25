/**
 * Logging helper
 *
 * @module utils/logger
 * @copyright 2015–2019 RewardOps Inc.
 */

const winston = require('winston');

const config = require('./../config');

/**
 * Winston logger configuration
 *
 * @type {Object}
 * @private
 */
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

/**
 * Whether the file logger is enabled.
 *
 * @type {Boolean}
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
    logger.add(winston.transports.File, {
      filename: config.get('logFilePath'),
      maxsize: 100000,
      maxFiles: 20,
    });

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
const toggleFileLogger = () => (isFileLoggerEnabled ? removeFileLogger() : addFileLogger());

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
 * NOTE: Will only return a log message if the {@link module:config} option `verbose` is `true`;
 * otherwise, returns `null`.
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
