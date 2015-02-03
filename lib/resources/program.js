/* Copyright 2015 RewardOps */
'use strict';

var programs  = require('./programs'),
    Orders    = require('./orders');

/*
 * Return a program object.
 *
 * @example
 *
 * // Returns a program object for the program with id 12
 * var myProgram = ro.program(12);
 *
 * @param {number} program_id - The ID of a program
 *
 * @constructor
 */

function Program(id) {
  this.id = id;
  this.orders = new Orders('program', id);
}

/*
 * Alias for ro.programs.get(id).
 *
 * @example
 *
 * // Makes an API request and returns details for the program
 * ro.program(12).details();
 *
 * @returns {Object} The program's JSON as an object
 */

Program.prototype.details = function(callback) {
  return programs.get(this.id, callback);
};

module.exports = Program;

