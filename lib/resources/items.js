/* Copyright 2019 RewardOps */
'use strict';

var config  = require('../config'),
    api     = require('../api');

/*
 * Factory for items objects.
 *
 * @example
 *
 * // Returns a items object for the program with ID 55
 * var items = ro.program(756).items;
 *
 * @param {number} programId - The ID of the items' parent program
 *
 * @returns {object}
 */

function items(programId) {
  /*
   * Get an array of item JSON objects.
   *
   * @example
   *
   * // Gets an array of item detail objects the program with id 12
   * ro.program(12).items.getAll(function(error, data) {
   *   // ...
   * });
   */

  function getAll(params, callback) {
    var options = {
      path: '/programs/' + programId + '/items',
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
   * Get a item JSON object.
   *
   * @example
   *
   * // Get JSON for the item with ID 938
   * ro.program(12).items.get(938, function(error, result, body) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function get(id, params, callback) {
    var options = {
      path: '/programs/' + programId + '/items/' + id,
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

  /*
   * Get an array of filter parameter JSON objects that are relevant to the program.
   *
   * @example
   *
   * // Gets an array of filter parameter objects for the program with id 12
   * ro.program(12).items.getParameters(function(error, data) {
   *   // ...
   * });
   */
  function getParameters(params, callback) {
    var options = {
      path: '/programs/' + programId + '/items/parameters',
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

  return {
    programId: programId,
    get: get,
    getAll: getAll,
    getParameters: getParameters
  };
}

module.exports = items;

