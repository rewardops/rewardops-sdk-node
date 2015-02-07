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

function ContextGetter(context) {
  this.context = context;
}

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
 * @param {function} callback
 *
 * @returns {object[]} An array of context member details
 */

ContextGetter.prototype.getAll = function(callback) {
  api.get('/' + this.context, config, function(error, data, response) {
    callback(error, data, response);
  });
};

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
 * @param {function} callback
 *
 * @returns {object} The context member's details as JSON, converted to a JS object
 */

ContextGetter.prototype.get = function(id, callback) {
  callback(null, {});
};

module.exports = ContextGetter;

