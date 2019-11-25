/**
 * Programs
 *
 * @module resources/programs
 * @copyright 2015–2019 RewardOps Inc.
 */

const items = require('./items');
const customCategories = require('./custom-categories');
const rewards = require('./rewards');
const { contextInstance, contextType } = require('../context');

/**
 * A program-specific context type object with `getAll` and `get` methods.
 *
 * @type {object}
 *
 * @example
 * // Get a list of all programs available to you.
 * // NOTE: Response may be paginated if you have many programs.
 * RO.programs.getAll((error, result, body) => {
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
 * Get a `program` object for the program with the specified `id`.
 *
 * The program object has methods for accessing the program's rewards and orders.
 *
 * @param {number} id The ID of a program
 * @returns {object} A program object for the program with the given ID
 *
 * @example
 * // Get details for program 123
 * cont myProgram = RO.program(123);
 * myProgram.details((error, result, body) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */
const program = id => {
  if (typeof id !== 'number') {
    return Error('Program ID must be a number');
  }

  /**
   * An alias of `programs.get(id)`.
   *
   * @param {apiCallback} callback The callback that handles the response.
   */
  const getProgramDetails = callback => {
    programs.get(id, callback);
  };

  return {
    details: getProgramDetails,
    items: items(id),
    customCategories: customCategories(id),
    rewards: rewards(id),
    ...contextInstance('programs', id),
  };
};

module.exports = { program, programs };
