/* Copyright 2019 RewardOps */
'use strict';

var orders  = require('./resources/orders'),
    config  = require('./config'),
    api     = require('./api');

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
   * ro.programs.getAll(function(error, data) {
   *   // ...
   * });
   *
   * @param {object} params - (Optional) Request params to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
   */

  function getAll(params, callback) {
    var options = {
      path: '/' + context,
      config: config.getAll()
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
      options.params = arguments[0];
    } else {
      callback = arguments[0];
    }

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  /*
   * Get details of the given context member
   *
   * @example
   *
   * // Get details for the program with id 493
   * ro.program.get(493, function(error, data) {
   *   // ...
   * });
   *
   * @param {number} id - The context member's id
   * @param {object} params - (Optional) Request params to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
   */

  function get(id, params, callback) {
    var options = {
      path: '/' + context + '/' + id,
      config: config.getAll()
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
      options.params = arguments[1];
    } else {
      callback = arguments[1];
    }

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  return {
    context: context,
    get: get,
    getAll: getAll
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
    contextTypeName: contextTypeName,
    id: id,
    orders: orders(contextTypeName, id)
  };
}

module.exports.contextInstance = contextInstance;
module.exports.contextType = contextType;

