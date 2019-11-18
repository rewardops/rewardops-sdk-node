/* Copyright 2019 RewardOps */
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
    getSummary: getSummary,
    create: create,
    update: update,
    updateOrderItems: updateOrderItems
  };

  /*
   * Get an order summary JSON objects.
   *
   * @example
   *
   * ro.program(12).orders.getSummary({
   *     // params
   *   }, function(error, result, body) {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function getSummary(params, callback) {
    var error, errorMessage;
    var options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/summary',
      config: config.getAll(),
      params: params
    };

    if (typeof params !== 'object') {
      // Validate that `params` exists and is an object.
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof params === 'function')) {
        callback = arguments[0];
      } else {
        callback = arguments[1];
      }

      callback(error);

      return;
    }

    options.params = params;

    api.get(options, function(error, data, response) {
      callback(error, data, response);
    });
  }

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

  function getAll(memberId, params, callback) {
    var options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders',
      config: config.getAll()
    };

    /*
     * If called with three arguments,
     * set options.params to the second
     * argument (`params`).
     *
     * Otherwise (i.e., called with just
     * two arguments), set the callback as
     * the second argument.
     */
    if (arguments.length === 3) {
      options.params = arguments[1];
    } else {
      options.params = {};
      callback = arguments[1];
    }

    options.params.member_id = memberId;

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

  function get(orderId, params, callback) {
    var options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/' + orderId,
      config: config.getAll()
    };

    /*
     * If called with three arguments,
     * set options.params to the second
     * argument (`params`).
     *
     * Otherwise (i.e., called with just
     * two arguments), set the callback as
     * the second argument.
     */
    if (arguments.length === 3) {
      options.params = arguments[1];
    } else {
      callback = arguments[1];
    }

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

  function create(params, callback) {
    var error,
        errorMessage,
        options;

    // Argument validations.
    if (typeof params !== 'object') {
      // Validate that `params` exists and is an object.
      errorMessage = 'A params object is required';
    } else if (config.get('apiVersion') === 'v3' && typeof params.reward_id !== 'number') {
      // Validate that `params.reward_id` is a number.
      // NOTE: This is only required in RewardOps API v3
      errorMessage = 'reward_id must be a number';
    } else if (config.get('apiVersion') === 'v4' && (!params.member || typeof params.member !== 'object')) {
      // Validate that `params.member` is an object.
      // NOTE: This is only required in RewardOps API v4
      errorMessage = 'must pass a member object in the params object to `orders.create()`';
    } else if (config.get('apiVersion') === 'v4' && !Array.isArray(params.items)) {
      // Validate that `params.items` is an array.
      // NOTE: This is only required in RewardOps API v4
      errorMessage = 'must pass an items array in the params object to `orders.create()`';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof params === 'function')) {
        callback = arguments[0];
      }

      callback(error);

      return;
    }

    options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders',
      config: config.getAll(),
      params: params
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

  function update(orderExternalId, params, callback) {
    var error,
        errorMessage,
        options;

    // Argument validations.
    if (typeof orderExternalId !== 'string') {
      errorMessage = 'must pass an order (external) ID as the first argument to `orders.update()`';
    } else if (typeof params !== 'object') {
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof orderExternalId === 'function')) {
        callback = arguments[0];
      } else if ((arguments.length === 2) && (typeof params === 'function')) {
        callback = arguments[1];
      }

      callback(error);

      return;
    }

    options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/' + orderExternalId,
      config: config.getAll(),
      params: params
    };

    api.patch(options, function(error, data, response) {
      callback(error, data, response);
    });
  }


  /*
   * Update all the order items in an order.
   *
   * @example
   *
   * // Makes a patch request to the API for the order on an orderItem level with the (external) ID of 'abc123' for program 12
   * ro.program(12).order.updateOrderItems('abc123', {
   *   // params
   * }, function(error, data) {
   *   // ...
   * });
   */

  function updateOrderItems(orderExternalId, params, callback) {
    var error,
        errorMessage,
        options;

    // Argument validations.
    if (typeof orderExternalId !== 'string') {
      errorMessage = 'must pass an order (external) ID as the first argument to `orders.updateOrderItems()`';
    } else if (typeof params !== 'object') {
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if ((arguments.length === 1) && (typeof orderExternalId === 'function')) {
        callback = arguments[0];
      } else if ((arguments.length === 2) && (typeof params === 'function')) {
        callback = arguments[1];
      }

      callback(error);

      return;
    }

    options = {
      path: '/' + orderObj.contextTypeName + '/' + orderObj.contextId + '/orders/' + orderExternalId + '/order_items',
      config: config.getAll(),
      params: params
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

