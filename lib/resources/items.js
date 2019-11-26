/**
 * Items resources
 *
 * @module resources/items
 * @copyright 2015–2019 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Curried function for creating a `getAll` program items function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/custom-categories~GetAllFunc} Returns `getAll` program items function.
 *
 * @protected
 */
const getAllProgramItems = programId => {
  /**
   * Get an array of item JSON objects.
   *
   * @param {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
   * @param {module:api~requestCallback} callback Callback that handles the response
   *
   * @example
   * // Gets an array of item detail objects the program with id 12
   * ro.program(12).items.getAll((error, data) => {
   *   // ...
   * });
   */
  return function getAll(params, callback) {
    const options = {
      path: `/programs/${programId}/items`,
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
 * Factory for items objects.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {ProgramItems} Program items object.
 *
 * @example
 * // Returns a items object for the program with ID 55
 * const items = ro.program(756).items;
 */
function items(programId) {
  /**
   * Get a item JSON object.
   *
   * @param id
   * @param {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
   * @param {module:api~requestCallback} callback Callback that handles the response
   *
   * @example
   * // Get JSON for the item with ID 938
   * ro.program(12).items.get(938, (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */
  function get(id, params, callback) {
    const options = {
      path: `/programs/${programId}/items/${id}`,
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
      // eslint-disable-next-line no-param-reassign
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  }

  /**
   * Get an array of filter parameter JSON objects that are relevant to the program.
   *
   * @param {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
   * @param {module:api~requestCallback} callback Callback that handles the response
   *
   * @example
   * // Gets an array of filter parameter objects for the program with id 12
   * ro.program(12).items.getParameters((error, data) => {
   *   // ...
   * });
   */
  function getParameters(params, callback) {
    const options = {
      path: `/programs/${programId}/items/parameters`,
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

  return {
    programId,
    get,
    getAll: getAllProgramItems(programId),
    getParameters,
  };
}

/**
 * Program items object.
 *
 * @typedef ProgramItems
 *
 * @property {number} programId The ID of the item's parent program
 * @property {Function} get
 * @property {Function} getAll
 * @property {Function} getParameters
 */

module.exports = items;
