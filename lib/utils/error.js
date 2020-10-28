const { LOG_PREFIX } = require('../constants');

/**
 * Class representing a configuration error.
 *
 * @augments Error
 */
class ConfigurationError extends Error {
  /**
   * Create a configuration error.
   *
   * @param {string} message Error message
   * @param  {...any} params Other Error params
   */
  constructor(message, ...params) {
    const configMessage = `${LOG_PREFIX} ERROR: ${message}`;

    super(configMessage, ...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigurationError);
    }

    this.name = 'ConfigurationError';
  }
}

module.exports = { ConfigurationError };
