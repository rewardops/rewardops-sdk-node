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
 * @param {string} context - The type of the parent context ('program')
 * @param {number} contextId - The ID of the orders' parent program
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
   * Get an array of order JSON objects.
   *
   * @example
   *
   * // Gets an array of order detail objects
   * // for the program with id 12 and member with ID 'abc123'
   * ro.program(12).orders.getAll('abc123', function(error, result, body) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
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
   * Get an order JSON object.
   *
   * @example
   *
   * // Gets JSON for the order with ID 938
   * ro.program(12).orders.get(938, function(error, result, body) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
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

  if (context === 'program') {
    return orderObj;
  } else {
    // TODO: Throw an error
    console.log('Can only create an orders object for programs');
  }
}

module.exports = orders;

