/* Copyright 2019 RewardOps */

const config = require('../config');
const api = require('../api');

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
  const orderObj = {
    contextTypeName,
    contextId,
  };

  /*
   * Get an order summary JSON objects.
   *
   * @example
   *
   * ro.program(12).orders.getSummary({
   *     // params
   *   }, (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function getSummary(params, callback) {
    let error;
    let errorMessage;
    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders/summary`,
      config: config.getAll(),
      params,
    };

    if (typeof params !== 'object') {
      // Validate that `params` exists and is an object.
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    options.params = params;

    api.get(options, (err, data, response) => {
      callback(err, data, response);
    });
  }

  /*
   * Get an array of order JSON objects.
   *
   * @example
   *
   * // Gets an array of order detail objects
   * // for the program with id 12 and member with ID 'abc123'
   * ro.program(12).orders.getAll('abc123', (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function getAll(memberId, params, callback) {
    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders`,
      config: config.getAll(),
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
      options.params = params;
    } else {
      options.params = {};
      callback = params;
    }

    options.params.member_id = memberId;

    api.get(options, (error, data, response) => {
      callback(error, data, response);
    });
  }

  /*
   * Get an order JSON object.
   *
   * @example
   *
   * // Gets JSON for the order with ID 938
   * ro.program(12).orders.get(938, (error, result, body) => {
   *   if (error) {
   *     console.log(error);
   *   } else {
   *     console.log(result);
   *   }
   * });
   */

  function get(orderId, params, callback) {
    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders/${orderId}`,
      config: config.getAll(),
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
      options.params = params;
    } else {
      callback = params;
    }

    api.get(options, (error, data, response) => {
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
   * }, (error, data) => {
   *   // ...
   * });
   */

  function create(params, callback) {
    let error;
    let errorMessage;

    // Argument validations.
    if (typeof params !== 'object') {
      // Validate that `params` exists and is an object.
      errorMessage = 'A params object is required';
    } else if (config.get('apiVersion') === 'v3' && typeof params.reward_id !== 'number') {
      // Validate that `params.reward_id` is a number.
      // NOTE: This is only required in RewardOps API v3
      errorMessage = 'reward_id must be a number';
    } else if (
      config.get('apiVersion') === 'v4' &&
      (!params.member || typeof params.member !== 'object')
    ) {
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

      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders`,
      config: config.getAll(),
      params,
    };

    api.post(options, (err, data, response) => {
      callback(err, data, response);
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
   * }, (error, data) => {
   *   // ...
   * });
   */

  function update(orderExternalId, params, callback) {
    let error;
    let errorMessage;

    // Argument validations.
    if (typeof orderExternalId !== 'string') {
      errorMessage = 'must pass an order (external) ID as the first argument to `orders.update()`';
    } else if (typeof params !== 'object') {
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if (arguments.length === 1 && typeof orderExternalId === 'function') {
        callback = orderExternalId;
      } else if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders/${orderExternalId}`,
      config: config.getAll(),
      params,
    };

    api.patch(options, (err, data, response) => {
      callback(err, data, response);
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
   * }, (error, data) => {
   *   // ...
   * });
   */

  function updateOrderItems(orderExternalId, params, callback) {
    let error;
    let errorMessage;

    // Argument validations.
    if (typeof orderExternalId !== 'string') {
      errorMessage =
        'must pass an order (external) ID as the first argument to `orders.updateOrderItems()`';
    } else if (typeof params !== 'object') {
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if (arguments.length === 1 && typeof orderExternalId === 'function') {
        callback = orderExternalId;
      } else if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    const options = {
      path: `/${orderObj.contextTypeName}/${orderObj.contextId}/orders/${orderExternalId}/order_items`,
      config: config.getAll(),
      params,
    };

    api.patch(options, (err, data, response) => {
      callback(err, data, response);
    });
  }

  if (contextTypeName === 'programs') {
    return {
      ...orderObj,
      get,
      getAll,
      getSummary,
      create,
      update,
      updateOrderItems,
    };
  }

  throw Error('Can only create an orders object for programs');
}

module.exports = orders;
