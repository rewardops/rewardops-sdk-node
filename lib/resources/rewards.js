/**
 * @copyright 2015–2019 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/*
 * Factory for rewards objects.
 *
 * @example
 *
 * // Returns a rewards object for the program with ID 55
 * var rewards = ro.program(756).rewards;
 *
 * @param {number} programId - The ID of the rewards' parent program
 *
 * @returns {object}
 */

function rewards(programId) {
  /*
   * Get an array of reward JSON objects.
   *
   * @example
   *
   * // Gets an array of reward detail objects the program with id 12
   * ro.program(12).rewards.getAll((error, data) => {
   *   // ...
   * });
   */

  function getAll(params, callback) {
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
  }

  /*
   * Get a reward JSON object.
   *
   * @example
   *
   * // Get JSON for the reward with ID 938
   * ro.program(12).rewards.get(938, (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function get(id, params, callback) {
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
  }

  return {
    programId,
    get,
    getAll,
  };
}

module.exports = rewards;
