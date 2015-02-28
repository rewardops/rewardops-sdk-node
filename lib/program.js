/* Copyright 2015 RewardOps */
'use strict';

var mixin = require('./utils/mixin'),
    programs = require('./resources/programs'),
    rewards = require('./resources/rewards'),
    context = require('./context');

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
    var error = new Error();

    error.message = 'Program ID must be a number';

    return error;
  }

  /*
   * Alias for RO.programs.get(id)
   *
   * @param {function} callback
   */

  function details(callback) {
    return programs.get(id, callback);
  }

  return mixin({
    details: details,
    rewards: rewards(id)
  }, context('program', id));
}

module.exports = program;

