/* Copyright 2015 RewardOps */
'use strict';

var config  = require('./config'),
    api     = require('./api');

/*
 * A context is a top-level actor in the RewardOps API.
 * Currently, there is only one type of context, 'programs'
 *
 * @params {string} context - The name of the context type ('programs')
 *
 * @returns {object}
 */

function contextGetter(context) {
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
   * @param {object} body - (Optional) A request body to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
   */

  function getAll(body, callback) {
    var options = {
      path: '/' + context,
      config: config
    };

    /*
     * If called with two arguments,
     * set options.body to the first
     * argument (`body`).
     *
     * Otherwise (i.e., called with just
     * one argument), set the callback as
     * the argument.
     */
    if (arguments.length === 2) {
      options.body = arguments[0];
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
   * @param {object} body - (Optional) A request body to pass to the API call
   * @param {apiCallback} callback - The callback that handles the response
   */

  function get(id, body, callback) {
    var options = {
      path: '/' + context + '/' + id,
      config: config
    };

    /*
     * If called with three arguments,
     * set options.body to the second
     * argument (`body`).
     *
     * Otherwise (i.e., called with just
     * two arguments), set the callback as
     * the second argument.
     */
    if (arguments.length === 3) {
      options.body = arguments[1];
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

module.exports = contextGetter;

