/**
 * Programs resources
 *
 * @module resources/programs
 * @copyright 2015–2020 RewardOps Inc.
 */

const items = require('./items');
const customCategories = require('./custom-categories');
const rewards = require('./rewards');
const { contextInstance, contextType } = require('../context');
const { coupons } = require('./coupons');
const subsegments = require('./subsegments');
const Personalization = require('./personalization');
const members = require('./members');
const memberSavedItems = require('./member-saved-items');

/**
 * A program-specific context type object with `getAll` and `get` methods.
 *
 * NOTE: Response may be paginated if you have many programs.
 *
 * @type {object}
 *
 * @example
 * // Get a list of all programs available to you.
 * RO.programs.getAll((error, responseBody, response) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 *
 * @see {@link module:context} for more information.
 */
const programs = contextType('programs');

/**
 * Get details of a program.
 *
 * The program object has methods for accessing the program's rewards and orders.
 *
 * @param {number} id The ID of a program
 * @param {string} code v5 uses `program_code` instead of `program_id`
 *
 * @returns {object} A program object for the program with the given ID
 *
 * @example
 * // Get details for program 123
 * const myProgram = RO.program(123);
 * myProgram.details((error, responseBody, response) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */
const program = (id, code) => {
  if (typeof id !== 'number') {
    return Error('Program ID must be a number');
  }

  /**
   * An alias of `programs.get(id)`.
   *
   * @param {module:api~requestCallback} callback Callback that handles the response.
   */
  const getProgramDetails = callback => {
    programs.get(id, callback);
  };

  return {
    details: getProgramDetails,
    items: items(id),
    subsegments: subsegments(code),
    customCategories: customCategories(id),
    rewards: rewards(id),
    coupons,
    personalization: Personalization(code),
    members: members(code),
    memberSavedItems: memberSavedItems(id, code),
    ...contextInstance('programs', id, code),
  };
};

module.exports = { program, programs };
