/* Copyright 2015 RewardOps */
'use strict';

var config = require('../config'),
    api    = require('../api');

/*
 * Factory for orders objects.
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
 * @param {string} context - The type of the parent context ('brand' or 'program')
 * @param {number} contextId - The ID of the orders' parent program or brand
 *
 * @returns {object}
 */

function orders(context, contextId) {
  /* jshint camelcase: false */

  var orderObj = {
    context: context,
    contextPlural: context + 's',
    contextId: contextId,
    get: get,
    getAll: getAll,
    create: create
  };

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

  function getAll(memberId, body, callback) {
    var options = {
      path: '/' + orderObj.contextPlural + '/' + orderObj.contextId + '/orders',
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
      options.body = {};
      callback = arguments[1];
    }

    options.body.member_id = memberId;

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

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

  function get(orderId, callback) {
    var options = {
      path: '/' + orderObj.contextPlural + '/' + orderObj.contextId + '/orders/' + orderId,
      config: config
    };

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  /*
   * Create an order.
   *
   * @example
   *
   * // Makes a post request to the API for a new order for program 12
   * ro.program(12).order.create({
   *   // params
   * }, function(error, data) {
   *   // ...
   * });
   *
   * @returns {object} An order JSON object
   */

  function create(body, callback) {
    var err;

    if (typeof body !== 'object') {
      var error = new Error();

      error.message = 'A body object is required';

      if ((arguments.length === 1) && (typeof body === 'function')) {
        callback = arguments[0];
      }

      callback(error);
    } else {
      var options = {
        path: '/' + orderObj.contextPlural + '/' + orderObj.contextId + '/orders',
        config: config,
        body: body
      };

      if (typeof options.body.reward_id !== 'number') {
        err = new Error();

        err.message = 'reward_id must be a number';

        callback(err);
      } else {
        api.post(options, function(error, data, response) {
          callback(error, data, response);
        });
      }
    }
  }

  /*
   * Update an order.
   *
   * @example
   *
   * // Makes a patch request to the API for the order with ID 444 for brand 12
   * ro.brand(12).order.update(444, {
   *   // params
   * }, function(error, data) {
   *   // ...
   * });
   *
   * @returns {object} An order JSON object
   */

  function update(orderId, params, callback) {
    callback(null, {});
  }

  if (context === 'brand') {
    orderObj.update = update;

    return orderObj;
  } else if (context === 'program') {
    return orderObj;
  } else {
    // TODO: Throw an error
    console.log('Can only create an orders object for brands and programs');
  }
}

module.exports = orders;

