/* Copyright 2015 RewardOps */
'use strict';

var config  = require('../config'),
    api     = require('../api');

/*
 * Factory for categories objects.
 *
 * @example
 *
 * // Returns a categories object for the program with ID 55
 * var categories = ro.program(756).categories;
 *
 * @param {number} programId - The ID of the categories' parent program
 *
 * @returns {object}
 */

function customCategories(programId) {
  /*
   * Get an array of item JSON objects.
   *
   * @example
   *
   * // Gets an array of item detail objects the program with id 12
   * ro.program(12).categories.getAll(function(error, data) {
   *   // ...
   * });
   */

  function getAll(body, callback) {
    var options = {
      path: '/programs/' + programId + '/custom_categories',
      config: config.getAll()
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
   * Get a item JSON object.
   *
   * @example
   *
   * // Get JSON for the item with ID 938
   * ro.program(12).categories.get(938, function(error, result, body) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function get(code, body, callback) {
    var error, errorMessage;
    var options = {
      path: '/programs/' + programId + '/custom_categories/' + code,
      config: config.getAll()
    };

    // Validate that code is a string
    if (typeof code !== 'string') {
      errorMessage = 'must pass a string as the category code';
    }


    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof code === 'function')) {
        callback = arguments[0];
      } else if ((arguments.length === 2) && (typeof body === 'function')) {
        callback = arguments[1];
      }

      callback(error);

      return;
    }

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
    programId: programId,
    get: get,
    getAll: getAll
  };
}

module.exports = customCategories;

