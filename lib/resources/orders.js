/* Copyright 2015 RewardOps */
'use strict';

/*
 * Constructor for orders objects.
 *
 * @example
 *
 * // Used in the context of a program
 * var orders = ro.program(12).orders;
 *
 * @example
 *
 * // Used in the context of a brand
 * var orders = ro.brand(756).orders;
 *
 * @param {number} program_id - The ID of the orders' parent program
 *
 * @constructor
 */

function ProgramOrders(context, contextId) {
  if (context === ('program' || 'brand')) {
    this.context = context;
  } else {
    // TODO: Throw an error
  }

  this.contextId = contextId;
}

/*
 * Return an array of order JSON objects.
 *
 * @example
 *
 * // Returns an array of order detail objects the program with id 12
 * ro.program(12).orders.getAll();
 *
 * @returns {object[]} An array of order detail objects
 */

ProgramOrders.prototype.getAll = function(callback) {
  callback(null, []);
};

/*
 * Return an order JSON object.
 *
 * @example
 *
 * // Returns JSON for the order with ID 938
 * ro.program(12).orders.get(938, function(error, response) {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(response);
 *   }
 * });
 *
 * @returns {object} An order JSON object
 */

ProgramOrders.prototype.get = function(id, callback) {
  callback(null, {});
};

/*
 * Create an order.
 *
 * @example
 *
 * // Makes a post request to the API and 
 * ro.program(12).orders.get('938');
 *
 * @returns {object} An order JSON object
 */

ProgramOrders.prototype.create = function(params, callback) {
  callback(null, {});
};

module.exports = ProgramOrders;

