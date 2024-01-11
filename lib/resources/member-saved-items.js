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
 * Factory for items objects.
 *
 * @param {number} programId The ID of the item's parent program
 *
 * @param code
 * @returns {module:resources/member_saved_items~ProgramItems} Program items object.
 *
 * @example
 * // Returns a items object for the program with ID 55
 * const items = ro.program(756).items;
 */
const memberSavedItems = (programId, code) => ({
  programId,
  getAll: getAllProgramItems(programId),
  summary: getSavedItemsSummary(code),
});

/**
 * Program items object.
 *
 * @typedef module:resources/items~ProgramItems
 *
 * @property {number} programId The ID of the item's parent program
 * @property {module:resources/msmber_saved_items~GetAllFunc} getAll `getAll` program items function.
 * @property {module:resources/member_saved_items_summary~GetAllSummaryFunc} summary
 */

module.exports = memberSavedItems;
