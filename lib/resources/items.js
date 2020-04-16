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
 * @returns {module:resources/items~GetAllFunc} Returns `getAll` program items function.
 *
 * @protected
 */
const getAllProgramItems = programId => {
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
 * Function for getting an array of item JSON objects.
 *
 * @typedef module:resources/items~GetAllFunc
 *
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Gets an array of item detail objects the program with id 12
 * ro.program(12).items.getAll((error, result, body) => {
 *   // ...
 * });
 */

/**
 * Curried function for creating a `get` program item function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~GetFunc} Returns `get` program item function.
 *
 * @protected
 */
const getProgramItem = programId => {
  return function get(itemId, params, callback) {
    const options = {
      path: `/programs/${programId}/items/${itemId}`,
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
  };
};

/**
 * Function for getting a item JSON object.
 *
 * @typedef module:resources/items~GetFunc
 *
 * @property {string} itemId Program item ID
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
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

/**
 * Curried function for creating a `getParameters` program item function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~GetParametersFunc} Returns `getParameters` program item function.
 *
 * @protected
 */
const getProgramItemParameters = programId => {
  return function getParameters(params, callback) {
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
  };
};

/**
 * Function for getting an array of filter parameter JSON objects that are relevant to the program.
 *
 * @typedef module:resources/items~GetParametersFunc
 *
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Gets an array of filter parameter objects for the program with id 12
 * ro.program(12).items.getParameters((error, result, body) => {
 *   // ...
 * });
 */

/**
 * Factory for items objects.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~ProgramItems} Program items object.
 *
 * @example
 * // Returns a items object for the program with ID 55
 * const items = ro.program(756).items;
 */
const items = programId => ({
  programId,
  get: getProgramItem(programId),
  getAll: getAllProgramItems(programId),
  getParameters: getProgramItemParameters(programId),
});

/**
 * Program items object.
 *
 * @typedef module:resources/items~ProgramItems
 *
 * @property {number} programId The ID of the item's parent program
 * @property {module:resources/items~GetFunc} get `get` program item function.
 * @property {module:resources/items~GetAllFunc} getAll `getAll` program items function.
 * @property {Function} getParameters
 */

module.exports = items;
