/* Copyright 2019 RewardOps */

const config = require('../config');
const api = require('../api');

/*
 * Factory for categories objects.
 *
 * @example
 *
 * // Returns a custom categories object for the program with ID 55
 * var categories = ro.program(756).customCategories;
 *
 * @param {number} programId - The ID of the categories' parent program
 *
 * @returns {object}
 */

function customCategories(programId) {
  /*
   * Get an array of customCategory JSON objects.
   *
   * @example
   *
   * // Gets an array of customCategory objects the program with id 12
   * ro.program(12).customCategories.getAll((error, data) => {
   *   // ...
   * });
   */

  function getAll(params, callback) {
    const options = {
      path: `/programs/${programId}/custom_categories`,
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
      // eslint-disable-next-line no-param-reassign
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  }

  /*
   * Get a customCategory JSON object.
   *
   * @example
   *
   * // Get JSON for the customCategory with code CAT_000002
   * ro.program(12).customCategories.get('CAT_000002', (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function get(code, params, callback) {
    let error;
    let errorMessage;
    const options = {
      path: `/programs/${programId}/custom_categories/${code}`,
      config: config.getAll(),
    };

    // Validate that code is a string
    if (typeof code !== 'string') {
      errorMessage = 'must pass a string as the category code';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if (arguments.length === 1 && typeof code === 'function') {
        // eslint-disable-next-line no-param-reassign
        callback = code;
      } else if (arguments.length === 2 && typeof params === 'function') {
        // eslint-disable-next-line no-param-reassign
        callback = params;
      }

      callback(error);

      return;
    }

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

    api.get(options, (err, data, response) => {
      callback(err, data, response);
    });
  }

  return {
    programId,
    get,
    getAll,
  };
}

module.exports = customCategories;
