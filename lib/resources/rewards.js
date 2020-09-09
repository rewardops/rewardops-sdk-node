/**
 * Rewards resources
 *
 * @module resources/rewards
 * @copyright 2015–2020 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Higher order function for `getAll` function program rewards.
 *
 * @param {number} programId The ID of the reward's parent program.
 *
 * @returns {GetAllProgramRewards} Returns an async `getAll` function for program rewards.
 *
 * @protected
 */
const getAllProgramRewards = programId => {
  return function getAll(params, callback) {
    const options = {
      path: `/programs/${programId}/rewards`,
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
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  };
};

/**
 * Get a list of rewards.
 *
 * @async
 *
 * @typedef GetAllProgramRewards
 *
 * @property {object} [params] A params object to send with the API request.
 * @property {module:api~requestCallback} callback callback Callback that handles the response.
 *
 * @example
 * // Gets a list of all running rewards for the program.
 * myProgram.rewards.getAll(
 *   {
 *     status: 'running',
 *   },
 *   (error, responseBody, response) => {
 *     if (error) {
 *       console.log(error);
 *     } else {
 *       console.log(result);
 *     }
 *   }
 * );
 */

/**
 * Higher order function for `get` function program rewards.
 *
 * @param {number} programId The ID of the reward's parent program.
 *
 * @returns {GetProgramRewards} Returns an async `get` function for a program reward.
 *
 * @protected
 */
const getProgramReward = programId => {
  return function get(id, params, callback) {
    const options = {
      path: `/programs/${programId}/rewards/${id}`,
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
      callback = params;
    }

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  };
};

/**
 * Get a reward JSON object by ID.
 *
 * @typedef GetProgramRewards
 *
 * @property {(string|number)} id A program reward ID
 * @property {object} [params] A params object to send with the API request.
 * @property {module:api~requestCallback} callback callback Callback that handles the response.
 *
 * @example
 * // Get JSON for the reward with ID 938
 * ro.program(12).rewards.get(938, (error, responseBody, response) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */

/**
 * Factory for rewards objects.
 *
 * @param {number} programId The ID of the rewards' parent program
 *
 * @returns {{programId: number, get: GetProgramRewards, getAll: GetAllProgramRewards}}
 *   Returns `programId` as well as `get` and `getAll` program rewards functions.
 *
 * @example
 * // Returns a rewards object for the program with ID 756
 * const rewards = ro.program(756).rewards;
 */
function rewards(programId) {
  return {
    programId,
    get: getProgramReward(programId),
    getAll: getAllProgramRewards(programId),
  };
}

module.exports = rewards;
