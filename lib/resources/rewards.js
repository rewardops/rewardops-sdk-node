/* Copyright 2015 RewardOps */
'use strict';

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
   * Return an array of reward JSON objects.
   *
   * @example
   *
   * // Returns an array of reward detail objects the program with id 12
   * ro.program(12).rewards.getAll(function(error, data) {
   *   // ...
   * });
   *
   * @returns {object[]} An array of reward detail objects
   */

  function getAll(callback) {
    callback(null, []);
  }

  /*
   * Return an reward JSON object.
   *
   * @example
   *
   * // Returns JSON for the reward with ID 938
   * ro.program(12).rewards.get(938, function(error, response) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(response);
   *   }
   * });
   *
   * @returns {object} An reward JSON object
   */

  function get(id, callback) {
    callback(null, {});
  }

  /*
   * Create an reward.
   *
   * @example
   *
   * // Makes a post request to the API for the reward with ID 938
   * ro.program(12).rewards.create({
   *   // params
   * }, function(error, data) {
   *   // ...
   * });
   *
   * @returns {object} An reward JSON object
   */

  function create(params, callback) {
    callback(null, {});
  }

  return {
    programId: programId,
    get: get,
    getAll: getAll,
    create: create
  };
}

module.exports = rewards;

