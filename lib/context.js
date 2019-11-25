/**
 * Context
 *
 * @module context
 * @copyright 2015–2019 RewardOps Inc.
 */

const orders = require('./resources/orders');
const config = require('./config');
const api = require('./api');

/**
 * A context is a top-level actor in the RewardOps API.
 *
 * NOTE: Currently, there is only one type of context ('programs')
 *
 * @param {string} context The name of the context type ('programs')
 * @returns {ContextType}
 */
function contextType(context) {
  /**
   * Return an array of context members.
   *
   * @param {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
   * @param {apiCallback} callback Callback that handles the response
   *
   * @example
   *
   * // Get a list of programs
   * ro.programs.getAll((error, data) => {
   *   // ...
   * });
   */
  function getAll(params, callback) {
    const options = {
      path: `/${context}`,
      config: config.getAll(),
    };

    /*
     * If called with two arguments,
     * set options.params to the first
     * argument (`params`).
     *
     * Otherwise (i.e., called with just
     * one argument), set the callback as
     * the argument.
     */
    if (arguments.length === 2) {
      options.params = params;
    } else {
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  }

  /**
   * Get details of the given context member
   *
   * @async
   *
   * @param {number} id The context member's id
   * @param {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
   * @param {apiCallback} callback Callback that handles the response
   *
   * @example
   *
   * // Get details for the program with id 493
   * ro.program.get(493, (error, data) => {
   *   // ...
   * });
   */
  function get(id, params, callback) {
    const options = {
      path: `/${context}/${id}`,
      config: config.getAll(),
    };

    /*
     * If called with three arguments,
     * set options.params to the second
     * argument (`params`).
     *
     * Otherwise (i.e., called with just
     * two arguments), set the callback as
     * the second argument.
     */
    if (arguments.length === 3) {
      options.params = params;
    } else {
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  }

  return {
    context,
    get,
    getAll,
  };
}

/**
 * Context type type definition
 *
 * @typedef ContextType
 * @type {object}
 * @property {string} context Context value
 * @property {Function} getAll Method that returns an array of context objects (e.g., programs)
 * @property {Function} get Method that returns a context object (e.g., program)
 */

/**
 * Return a context object (i.e. a `program` object).
 *
 * @param {string} contextTypeName The context type name (e.g., `programs`). This should be plural.
 * @param {number} id The ID for the context
 *
 * @returns {ContextInstance}
 */
const contextInstance = (contextTypeName, id) => ({
  contextTypeName,
  id,
  orders: orders(contextTypeName, id),
});

/**
 * Context instance type definition
 *
 * @typedef ContextInstance
 * @type {object}
 * @property {string} contextTypeName See {@link contextInstance}
 * @property {number} id See {@link contextInstance}
 * @property {Function}
 */

module.exports = { contextInstance, contextType };

/**
 * Callbacks follow the [Node.js error-first callback pattern]{@link https://nodejs.org/api/errors.html#errors_error_first_callbacks}.
 *
 * @callback apiCallback
 * @param {Error|null} error
 * @param {object} result The 'result' object from the API response body
 * @param {object} body The full body of the response from the API. This includes pagination details, if present
 */
