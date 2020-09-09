/**
 * Custom categories resources
 *
 * @module resources/custom-categories
 * @copyright 2015–2020 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Higher order function for creating a `getAll` program custom categories function.
 *
 * @param {number} programId The ID of the custom category's parent program
 *
 * @returns {module:resources/custom-categories~GetAllFunc} Returns `getAll` program custom categories function.
 *
 * @protected
 */
const getAllProgramCustomCategories = programId => {
  return function getAll(params, callback) {
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
  };
};

/**
 * Function for getting an array of customCategory JSON objects.
 *
 * @typedef module:resources/custom-categories~GetAllFunc
 *
 * @property {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Gets an array of customCategory objects the program with id 12
 * ro.program(12).customCategories.getAll((error, data) => {
 *   // ...
 * });
 */

/**
 * Higher order function for creating a `get` program custom categories function.
 *
 * @param {number} programId The ID of the custom category's parent program
 *
 * @returns {module:resources/custom-categories~GetFunc} Returns `get` program custom categories function.
 *
 * @protected
 */
const getProgramCustomCategory = programId => {
  return function get(code, params, callback) {
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
  };
};

/**
 * Function for getting a customCategory JSON object.
 *
 * @typedef module:resources/custom-categories~GetFunc
 *
 * @property {string} code Custom category code
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Get JSON for the customCategory with code CAT_000002
 * ro.program(12).customCategories.get('CAT_000002', (error, responseBody, response) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */

/**
 * Factory for categories objects.
 *
 * @param {number} programId The ID of the category's parent program
 *
 * @returns {module:resources/custom-categories~CustomCategories} Returns Custom categories object.
 *
 * @example
 * // Returns a custom categories object for the program with ID 55
 * var categories = ro.program(756).customCategories;
 */
const customCategories = programId => ({
  programId,
  get: getProgramCustomCategory(programId),
  getAll: getAllProgramCustomCategories(programId),
});

/**
 * Custom categories object.
 *
 * @typedef module:resources/custom-categories~CustomCategories
 *
 * @property {number} programId The ID of the category's parent program
 * @property {module:resources/custom-categories~GetFunc} get
 * @property {module:resources/custom-categories~GetAllFunc} getAll
 */

module.exports = customCategories;
