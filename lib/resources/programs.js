/* Copyright 2015 RewardOps */
'use strict';

/*
 * Return an array of programs
 *
 * @example
 *
 * // Returns a list of programs
 *
 * ro.programs.getAll();
 *
 * @returns {object[]} An array of programs and their details
 */

function getAll(callback) {
  callback(null, []);
}

/*
 * Return details of the given program
 *
 * @example
 *
 * // Returns details for the program with id 12
 * ro.program.get(12);
 *
 * @param {number} id - The program's id
 * @param {function} callback
 *
 * @returns {object} A program's details as JSON, converted to a JS object
 */

function get(id, callback) {
  callback(null, {});
}

module.exports = {
  getAll: getAll,
  get: get
};

