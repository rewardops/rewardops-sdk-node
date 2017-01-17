/* Copyright 2015 RewardOps */
'use strict';

var mixin           = require('../utils/mixin'),
    items           = require('./items'),
    rewards         = require('./rewards'),
    context         = require('../context'),
    contextInstance = context.contextInstance,
    contextType     = context.contextType;

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
   * @param {apiCallback} callback - The callback that handles the response
   */

  function programDetails(callback) {
    return programs.get(id, callback);
  }

  return mixin({
    details: programDetails,
    items: items(id),
    rewards: rewards(id)
  }, contextInstance('programs', id));
}

var programs = contextType('programs');

module.exports.programs = programs;
module.exports.program = program;

