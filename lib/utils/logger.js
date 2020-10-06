/**
 * Logging helper
 *
 * @module utils/logger
 * @copyright 2015–2020 RewardOps Inc.
 */

const winston = require('winston');

const config = require('./../config');

/**
 * @param opts
 */
function convertOptionsToWinstonV3(opts) {
  const newOpts = {};
  const formatArray = [];
  const formatOptions = {
    stringify: () =>
      winston.format(info => {
        info.message = JSON.stringify(info.message);
      })(),
    formatter: () =>
      winston.format(info => {
        info.message = opts.formatter(Object.assign(info, opts));
      })(),
    json: () => winston.format.json(),
    raw: () => winston.format.json(),
    label: () => winston.format.label(opts.label),
    logstash: () => winston.format.logstash(),
    prettyPrint: () => winston.format.prettyPrint({ depth: opts.depth || 2 }),
    colorize: () =>
      winston.format.colorize({
        level: opts.colorize === true || opts.colorize === 'level',
        all: opts.colorize === 'all',
        message: opts.colorize === 'message',
      }),
    timestamp: () => winston.format.timestamp(),
    align: () => winston.format.align(),
    showLevel: () =>
      winston.format(info => {
        info.message = `${info.level}: ${info.message}`;
      })(),
  };
  Object.keys(opts)
    .filter(k => !Object.keys(formatOptions).includes(k))
    .forEach(k => {
      newOpts[k] = opts[k];
    });
  Object.keys(opts)
    .filter(k => Object.keys(formatOptions).includes(k) && formatOptions[k])
    .forEach(k => formatArray.push(formatOptions[k]()));
  newOpts.format = winston.format.combine(...formatArray);
  return newOpts;
}

/**
 * Winston logger configuration
 *
 * @type {winston.Logger}
 * @private
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(
      convertOptionsToWinstonV3({
        timestamp: () => new Date().toISOString(),

        formatter: options =>
          `RewardOps SDK ${options.level.toUpperCase()} ` +
          `[${options.timestamp()}] ${undefined !== options.message ? options.message : ''}${
            options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''
          }`,
      })
    ),
  ],
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
 * @param {string} level Log level
 *
 * @returns {winston.log|null} Returns a log message if the {@link module:config} option `verbose` is `true`;
 * otherwise, returns `null`.
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

// TODO: implement this logic as an event process (triggered by config.init) using the emitter module.
// This is a breaking change, so it should be a part of the next major release.
if (config.get('logToFile')) {
  setLogFilePath();
}

module.exports = { log, setLogFilePath };
