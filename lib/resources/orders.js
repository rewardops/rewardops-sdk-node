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
 * @param {string} contextTypeName - The type of the parent context ('programs')
 * @param {number} contextId - The ID of the orders' parent program
 *
 * @returns {object}
 */

function orders(contextTypeName, contextId) {
  /* jshint camelcase: false */

  var orderObj = {
    contextTypeName: contextTypeName,
    contextId: contextId,
    get: get,
    getAll: getAll,
    create: create,
    update: update
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
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders',
      config: config.getAll()
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
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/' + orderId,
      config: config.getAll()
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
    var error,
        errorMessage,
        options;

    // Argument validations.
    if (typeof body !== 'object') {
      // Validate that `body` exists and is an object.
      errorMessage = 'A body object is required';
    } else if (config.get('apiVersion') === 'v3' && typeof body.reward_id !== 'number') {
      // Validate that `body.reward_id` is a number.
      // NOTE: This is only required in RewardOps API v3
      errorMessage = 'reward_id must be a number';
    } else if (config.get('apiVersion') === 'v4' && (!body.member || typeof body.member !== 'object')) {
      // Validate that `body.member` is an object.
      // NOTE: This is only required in RewardOps API v4
      errorMessage = 'must pass a member object in the body object to `orders.create()`';
    } else if (config.get('apiVersion') === 'v4' && !Array.isArray(body.items)) {
      // Validate that `body.items` is an array.
      // NOTE: This is only required in RewardOps API v4
      errorMessage = 'must pass an items array in the body object to `orders.create()`';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof body === 'function')) {
        callback = arguments[0];
      }

      callback(error);

      return;
    }

    options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders',
      config: config.getAll(),
      body: body
    };

    api.post(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  /*
   * Update an order.
   *
   * @example
   *
   * // Makes a patch request to the API for the order with the (external) ID of 'abc123' for program 12
   * ro.program(12).order.update('abc123', {
   *   // params
   * }, function(error, data) {
   *   // ...
   * });
   */

  function update(orderExternalId, body, callback) {
    var error,
        errorMessage,
        options;

    // Argument validations.
    if (typeof orderExternalId !== 'string') {
      errorMessage = 'must pass an order (external) ID as the first argument to `orders.update()`';
    } else if (typeof body !== 'object') {
      errorMessage = 'A body object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof orderExternalId === 'function')) {
        callback = arguments[0];
      } else if ((arguments.length === 2) && (typeof body === 'function')) {
        callback = arguments[1];
      }

      callback(error);

      return;
    }

    options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/' + orderExternalId,
      config: config.getAll(),
      body: body
    };

    api.patch(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

  if (contextTypeName === 'programs') {
    return orderObj;
  } else {
    // TODO: Throw an error
    console.log('Can only create an orders object for programs');
  }
}

module.exports = orders;

