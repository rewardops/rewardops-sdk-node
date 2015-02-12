/* Copyright 2015 RewardOps */
'use strict';

var config  = require('./config'),
    api     = require('./api');

/*
 * A context is a top-level actor in the RewardOps API.
 * Currently, there are two types of contexts:
 * Programs and Brands
 *
 * @params {string} context - The name of the context type ('programs' or 'brands')
 *
 * @constructor
 */

function contextGetter(context) {
  /*
   * Return an array of context members
   *
   * @example
   *
   * // Returns a list of brands
   * ro.brands.getAll(function(error, data) {
   *   // ...
   * });
   *
   * // Returns a list of programs
   * ro.programs.getAll(function(error, data) {
   *   // ...
   * });
   *
   * @param {object} body - (Optional) A request body to pass to the API call
   * @param {function} callback
   *
   * @returns {object[]} An array of context member details
   */

  function getAll(body, callback) {
    var options = {
      path: '/' + context,
      config: config
    };

    /*
     * If called with two arguments,
     * set options.body to the first
     * argument (`body`).
     *
     * Otherwise (i.e., called with just
     * one argument), set the callback as
     * the argument.
     */
    if (arguments.length === 2) {
      options.body = arguments[0];
    } else {
      callback = arguments[0];
    }

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  /*
   * Return details of the given context member
   *
   * @example
   *
   * // Returns details for the program with id 493
   * ro.program.get(493, function(error, data) {
   *   // ...
   * });
   *
   * // Returns details for the brand with id 12
   * ro.brand.get(12, function(error, data) {
   *   // ...
   * });
   *
   * @param {number} id - The context member's id
   * @param {object} body - (Optional) A request body to pass to the API call
   * @param {function} callback
   *
   * @returns {object} The context member's details as JSON, converted to a JS object
   */

  function get(id, body, callback) {
    var options = {
      path: '/' + context + '/' + id,
      config: config
    };

    /*
     * If called with three arguments,
     * set options.body to the second
     * argument (`body`).
     *
     * Otherwise (i.e., called with just
     * two arguments), set the callback as
     * the second argument.
     */
    if (arguments.length === 3) {
      options.body = arguments[1];
    } else {
      callback = arguments[1];
    }

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  return {
    context: context,
    get: get,
    getAll: getAll
  };
}

module.exports = contextGetter;

