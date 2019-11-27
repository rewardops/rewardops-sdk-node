/* Copyright 2019 RewardOps */

const orders = require('./resources/orders');
const config = require('./config');
const api = require('./api');

/*
 * A context is a top-level actor in the RewardOps API.
 * Currently, there is only one type of context, 'programs'
 *
 * @params {string} context - The name of the context type ('programs')
 *
 * @returns {object}
 */

function contextType(context) {
  /*
   * Return an array of context members
   *
   * @example
   *
   * // Gets a list of programs
   * ro.programs.getAll((error, data) => {
   *   // ...
   * });
   *
   * @param {object} params - (Optional) Request params to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
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

  /*
   * Get details of the given context member
   *
   * @example
   *
   * // Get details for the program with id 493
   * ro.program.get(493, (error, data) => {
   *   // ...
   * });
   *
   * @param {number} id - The context member's id
   * @param {object} params - (Optional) Request params to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
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

/*
 * Return a context object, i.e., a program object.
 *
 * @param {string} contextTypeName - The context type name ('programs'). This should be plural.
 * @param {number} id - The id for the context
 *
 * @returns {object}
 */

function contextInstance(contextTypeName, id) {
  return {
    contextTypeName,
    id,
    orders: orders(contextTypeName, id),
  };
}

module.exports.contextInstance = contextInstance;
module.exports.contextType = contextType;
