/**
 * Member Saved Items resources
 *
 * @module resources/items
 * @copyright 2015–2024 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Higher order function for creating a `getAll` program items function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~GetAllFunc} Returns `getAll` program items function.
 *
 * @see {@link module:resources/items~GetAllFunc} for examples.
 *
 * @protected
 */
const getAllProgramItems = programId => {
  return function getAll(params, callback) {
    const options = {
      path: `/programs/${programId}/member_saved_items`,
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

    api.get(options, callback);
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
 * ro.program(12).items.getAll((error, responseBody, response) => {
 *   // ...
 * });
 */

/**
 * Higher order function for creating a `get` program item function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~GetFunc} Returns `get` program item function.
 *
 * @see {@link module:resources/items~GetFunc} for examples.
 *
 * @protected
 */
const getProgramItem = programId => {
  return function get(itemId, params, callback) {
    const options = {
      path: `/programs/${programId}/member_saved_items/${itemId}`,
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

    api.get(options, callback);
  };
};

/**
 * Higher order function for creating a `getParameters` program item function.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @returns {module:resources/items~GetParametersFunc} Returns `getParameters` program item function.
 *
 * @see {@link module:resources/items~GetParametersFunc} for examples.
 *
 * @protected
 */
const getProgramItemParameters = programId => {
  return function getParameters(params, callback) {
    const options = {
      path: `/programs/${programId}/member_saved_items/parameters`,
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

    api.get(options, callback);
  };
};

/**
 * @param {string} programCode string that contains the programCode
 * @returns api caller
 */
const getSavedItemsSummary = programCode => {
  return function savedItemsSummary(memberUUID, callback) {
    const options = {
      path: `/programs/${programCode}/members/${memberUUID}/member_saved_items/summary`,
      config: {
        ...config.getAll(),
        apiVersion: 'v5',
      },
    };

    api.get(options, callback);
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
 * ro.program(12).items.getParameters((error, responseBody, response) => {
 *   // ...
 * });
 */

/**
 * Factory for items objects.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @param code
 * @returns {module:resources/items~ProgramItems} Program items object.
 *
 * @example
 * // Returns a items object for the program with ID 55
 * const items = ro.program(756).items;
 */
const memberSavedItems = (programId, code) => ({
  programId,
  get: getProgramItem(programId),
  getAll: getAllProgramItems(programId),
  getParameters: getProgramItemParameters(programId),
  summary: getSavedItemsSummary(code),
});

/**
 * Program items object.
 *
 * @typedef module:resources/items~ProgramItems
 *
 * @property {number} programId The ID of the item's parent program
 * @property {module:resources/member_saved_items~GetFunc} get `get` program item function.
 * @property {module:resources/msmber_saved_items~GetAllFunc} getAll `getAll` program items function.
 * @property {Function} getParameters Get parameters function
 */

module.exports = memberSavedItems;
