'use strict';

var programs = require('./programs');

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
 * @returns {Object} A program object
 */

function program(id) {
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

  function details(callback) {
    return programs.get(id, callback);
  }

  /*
   * Return an array of order objects.
   *
   * @example
   *
   * // Returns an array of order detail objects the program with id 12
   * ro.program(12).orders.getAll();
   *
   * @returns {object[]} An array of order detail objects
   */

  function getAllOrders(callback) {
    callback(null, []);
  }

  return {
    id: id,
    details: details,
    orders: {
      getAll: getAllOrders
    }
  };
}

module.exports = program;

