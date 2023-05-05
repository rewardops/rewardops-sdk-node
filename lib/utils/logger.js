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
const { isEmpty, isPlainObject, isArray, flow, forEach } = require('lodash');
const redact = require('redact-secrets');
const Redactyl = require('redactyl.js');
const { serializeError } = require('serialize-error');

const config = require('../config');
const { LOG_PREFIX } = require('../constants');

const { combine, timestamp: timestampFormatter, printf } = winston.format;

/**
 * Redacted message placeholder value
 *
 * @private
 */
const REDACTED_MESSAGE = '[REDACTED]';

/**
 * Reports whether a value is either an array or object, and therefore
 * can be traversed as valid JSON (i.e. JSON-stringifiable).
 *
 * @param {*} value Any value
 *
 * @returns {boolean} Report of whether value can be traversed as JSON
 *
 * @private
 */
const isJSON = value => isPlainObject(value) || isArray(value);

/**
 * Pretty print a given value.
 *
 * @param {object|Array} json JSON object
 *
 * @returns {string} Prettier JSON string
 *
 * @private
 */
const prettyPrint = json => JSON.stringify(json, undefined, 2);

/**
 * Deeply iterate over an object and redact secret values by replacing
 * them with a `REDACTED_MESSAGE` const string.
 *
 * @param {object} obj Object with potential secrets
 *
 * @returns {object} New object with secrets redacted
 *
 * @private
 */
const redactSecrets = obj => redact(REDACTED_MESSAGE).map(obj);

/**
 * List of Personally Identifiable Information (PII) that we want to filter from the logs.
 */
const PIIAttributes = [
  'Authorization',
  'full_name',
  'email',
  'phone',
  'address',
  'address_2',
  'city',
  'postal_code',
  'country_code',
  'country_subregion_code',
  'ip_address',
];

const redactyl = new Redactyl({
  properties: PIIAttributes,
});

/**
 * Deeply iterate over an object and redact PII values by replacing
 * them with a `REDACTED_MESSAGE` const string.
 *
 * @param {object} data Object with potential PII data
 *
 * @returns {object} New object with PII data redacted
 *
 * @private
 */
const filterLogData = data => {
  if (data instanceof Error) {
    /*
     * serialize Error to plain object to avoid error:
     *
     * `TypeError: Cannot convert object to primitive value`
     */
    data = serializeError(data);
  }

  // TODO: Look for another alternative for format error messages (formatErrorMessage)
  return isPlainObject(data)
    ? flow([rawData => redactSecrets(rawData), redactedData => redactyl.redact(redactedData)])(data)
    : data;
};

/**
 * Filters log data for PII and secrets, then formats the data using the `prettyPrint` function.
 *
 * @param {object} data Unfiltered data object
 *
 * @returns {string} Stringified, filtered data object
 *
 * @private
 */
const processLogData = flow([filterLogData, prettyPrint]);

/**
 * Formats a message according to its type.
 *
 * If given a JSON-stringifiable object, it redacts any potential secrets
 * and pretty prints; otherwise, it simply passes through the message.
 *
 * @param {*} message Log message
 *
 * @returns {string} Formatted message
 * @private
 */
const formatMessage = message => (isJSON(message) ? prettyPrint(redactSecrets(message)) : message);

/**
 * Get Winston log level based on SDK configuration.
 *
 * @returns {string} Log level
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

/**
 * RewardOps log format
 *
 * @param {object} options Log format options
 * @param {string|number} options.level Log level
 * @param {string} options.message Log message
 * @param {string} options.timestamp Log timestamp
 * @param {object} options.meta Logging metadata
 * @returns {string} Formatted log string
 * @private
 */
const logFormat = ({ level, message = '', timestamp, meta = {} }) =>
  [
    `[${timestamp}]`,
    `[${LOG_PREFIX} ${level.toUpperCase()}]`,
    `[${formatMessage(message)}]`,
    isEmpty(meta) ? '' : `\nMetadata:\t${prettyPrint(meta)}`,
  ]
    .join(' ')
    .trim();

/**
 * Create Winston Console Transport
 *
 * @returns Winston Console Transport with configured log level
 * @private
 */
const consoleTransport = new winston.transports.Console({ level: getLogLevel(), silent: config.get('silent') });

/**
 * Winston logger configuration
 *
 * @type {winston.Logger}
 * @private
 */
const logger = winston.createLogger({
  format: combine(timestampFormatter(), printf(logFormat)),
  transports: [consoleTransport],
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
 * Set/Reset log-to-file configuration for `logger`.
 *
 * @see {@link logger} for more information.
 * @private
 */
const setFileLogger = () => {
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

  setFileLogger();
}

/** Flag for whether logger setup has completed (following config module init) */
let isLoggerSetupComplete = false;

/**
 * Update logger setup with Console Transform and optional File Transform.
 *
 * Used following library config initialization to adjust logging, if necessary.
 *
 * @private
 */
const completeLogSetup = () => {
  if (config.isInitialized()) {
    isLoggerSetupComplete = true;

    consoleTransport.level = getLogLevel();
    consoleTransport.silent = config.get('silent');

    // TODO: implement this logic as an event process (triggered by config.init) using the emitter module.
    // This is a breaking change, so it should be a part of the next major release.
    if (config.get('logToFile')) {
      setLogFilePath();
    }
  }
};

/**
 * Reset logger setup.
 *
 * Used for testing purposes.
 *
 * @private
 */
const resetLoggerSetup = () => {
  isLoggerSetupComplete = false;
};

/**
 * Takes a message string and a data object, returning a string with redacted and filtered data.
 *
 * @param {string} message The string template with placeholders.
 * @param {object} data Object containing unfiltered data to be included in the log message.
 *
 * @returns {string} log string with filtered values.
 */
const mergeMessageAndData = (message, data) => {
  let newMessage = message;

  forEach(data, (value, key) => {
    newMessage = newMessage.replace(`{${key}}`, processLogData(value));
  });

  return newMessage;
};

/**
 * Log a message to console in accordance with the SDK configuration
 *
 * NOTE: If an Error object is passed as the message, it will log both the error's
 * message and stack trace.
 *
 * @param {string} message Log message
 * @param {object} options Options object
 * @param {string} options.level Log level
 * @param {object} options.meta Optional log metadata
 * @param {object} options.data Optional log data to be sanitized and replace log placeholders
 *
 * @returns {winston.log|null} Returns a log message, along with optional metadata
 * (if the {@link module:config} option `verbose` is `true`).
 */
function log(message, { level = 'info', meta = {}, data = {} } = {}) {
  if (!isLoggerSetupComplete) {
    completeLogSetup();
  }

  if (message instanceof Error) {
    const error = message;
    message = `${error.message}\n${error.stack}`;
    level = 'error';
  } else if (!isEmpty(data)) {
    message = mergeMessageAndData(message, data);
  }

  return logger.log(level, { message, meta: config.get('verbose') && filterLogData(meta) });
}

module.exports = {
  log,
  logFormat,
  formatMessage,
  getLogLevel,
  setLogFilePath,
  prettyPrint,
  redactSecrets,
  REDACTED_MESSAGE,
  filterLogData,
  processLogData,
  resetLoggerSetup,
};
