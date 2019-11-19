/* Copyright 2019 RewardOps */

const mixin = require('../utils/mixin');
const items = require('./items');
const customCategories = require('./customCategories');
const rewards = require('./rewards');
const context = require('../context');

const { contextInstance } = context;
const { contextType } = context;
const programs = contextType('programs');

/*
 * Return a program object.
 *
 * @example
 *
 * // Returns a program object for the program with id 12
 * var myProgram = ro.program(12);
 *
 * @param {number} id - The ID of a program
 *
 * @returns {object}
 */

function program(id) {
  if (typeof id !== 'number') {
    const error = new Error();

    error.message = 'Program ID must be a number';

    return error;
  }

  /*
   * Alias for RO.programs.get(id)
   *
   * @param {apiCallback} callback - The callback that handles the response
   */

  function programDetails(callback) {
    return programs.get(id, callback);
  }

  return mixin(
    {
      details: programDetails,
      items: items(id),
      customCategories: customCategories(id),
      rewards: rewards(id),
    },
    contextInstance('programs', id)
  );
}

module.exports.programs = programs;
module.exports.program = program;
