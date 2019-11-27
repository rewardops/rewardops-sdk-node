/**
 * Orders resources
 *
 * @module resources/orders
 * @copyright 2015–2019 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Curried function for creating a `getOrderSummary` function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~GetSummaryFunc} `getSummary` orders function in context
 *
 * @protected
 */
const getOrderSummaryInContext = orderContext => {
  return function getSummary(params, callback) {
    const options = {
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders/summary`,
      config: config.getAll(),
      params,
    };

    if (typeof params !== 'object') {
      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(Error('A params object is required'));

      return;
    }

    options.params = params;

    api.get(options, (err, data, response) => {
      callback(err, data, response);
    });
  };
};

/**
 * Get an order summary JSON objects function.
 *
 * @typedef module:resources/orders~GetSummaryFunc
 *
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * ro.program(12).orders.getSummary({},
 * (error, result, body) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */

/**
 * Curried function for creating a `getAll` orders function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~GetAllFunc} `getAll` orders function in context
 *
 * @protected
 */
const getAllOrdersInContext = orderContext => {
  return function getAll(memberId, params, callback) {
    const options = {
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders`,
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
  };
};

/**
 * Get an array of order JSON objects function.
 *
 * @typedef module:resources/orders~GetAllFunc
 *
 * @property {number} memberId Member ID
 * @property {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Get an array of order details
 * // for the program with id 12 and member with ID 'abc123'
 * ro.program(12).orders.getAll('abc123', (error, result, body) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */

/**
 * Curried function for creating a `get` order function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~GetFunc} `get` order function in context
 *
 * @protected
 */
const getOrderInContext = orderContext => {
  return function get(orderId, params, callback) {
    const options = {
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders/${orderId}`,
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
  };
};

/**
 * Get an order JSON object function.
 *
 * @typedef module:resources/orders~GetFunc
 *
 * @property {string} orderId Order ID
 * @property {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Gets JSON for the order with ID 938
 * ro.program(12).orders.get(938, (error, result, body) => {
 *   if (error) {
 *     console.log(error);
 *   } else {
 *     console.log(result);
 *   }
 * });
 */

/**
 * Curried function for creating a `create` order function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~CreateFunc} `create` order function in context
 *
 * @protected
 */
const createOrderInContext = orderContext => {
  return function create(params, callback) {
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

      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    const options = {
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders`,
      config: config.getAll(),
      params,
    };

    api.post(options, (err, data, response) => {
      callback(err, data, response);
    });
  };
};

/**
 * Create an order function.
 *
 * NOTE: The `params` object is required and must include a `reward_id` and a `member` object.
 *
 * @typedef module:resources/orders~CreateFunc
 *
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the API call.
 * @property {module:api~requestCallback} callback Callback that handles the response.
 *
 * @example
 * // TODO: ensure that this documentation is still accurate
 * // Posts a new order for program `12`, with reward `45231` for member 'jb0987'
 * ro.program(12).order.create(
 *   {
 *     reward_id: 45231,
 *     member: {
 *       id: 'jb0987',
 *       full_name: 'Jolanta Banicki',
 *       email: 'jolanta.b@example.com',
 *     },
 *   },
 *   (error, result, body) => {
 *     if (error) {
 *       console.log(error);
 *     } else {
 *       console.log(result);
 *     }
 *   }
 * );
 */

/**
 * Curried function for creating a `update` order function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~UpdateFunc} `update` order function in context
 *
 * @protected
 */
const updateOrderInContext = orderContext => {
  return function update(orderExternalId, params, callback) {
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
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders/${orderExternalId}`,
      config: config.getAll(),
      params,
    };

    api.patch(options, (err, data, response) => {
      callback(err, data, response);
    });
  };
};

/**
 * Update an order function.
 *
 * @typedef module:resources/orders~UpdateFunc
 *
 * @property {string} orderExternalId External order ID.
 * @property {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call.
 * @property {module:api~requestCallback} callback Callback that handles the response.
 *
 * @example
 * // Makes a patch request to the API for the order with the (external) ID of 'abc123' for program 12
 * ro.program(12).order.update('abc123', {
 *   // params
 * }, (error, data) => {
 *   // ...
 * });
 */

/**
 * Curried function for creating a `updateOrderItems` function in context.
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~UpdateFunc} `updateOrderItems` function in context
 *
 * @protected
 */
const updateOrderItemsInContext = orderContext => {
  return function updateOrderItems(externalOrderId, params, callback) {
    let error;
    let errorMessage;

    // Argument validations.
    if (typeof externalOrderId !== 'string') {
      errorMessage = 'must pass an order (external) ID as the first argument to `orders.updateOrderItems()`';
    } else if (typeof params !== 'object') {
      errorMessage = 'A params object is required';
    }

    if (errorMessage) {
      error = new Error();

      error.message = errorMessage;

      if (arguments.length === 1 && typeof externalOrderId === 'function') {
        callback = externalOrderId;
      } else if (arguments.length === 2 && typeof params === 'function') {
        callback = params;
      }

      callback(error);

      return;
    }

    const options = {
      path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders/${externalOrderId}/order_items`,
      config: config.getAll(),
      params,
    };

    api.patch(options, (err, data, response) => {
      callback(err, data, response);
    });
  };
};

/**
 * Function for updating all the items in an order.
 *
 * @typedef module:resources/orders~UpdateOrderItemsFunc
 *
 * @property {(string)} externalOrderId External order ID.
 * @property {object} [params] [Request]{@link https://github.com/request/request} params to pass to the API call
 * @property {module:api~requestCallback} callback Callback that handles the response
 *
 * @example
 * // Makes a patch request to the API for the order on an orderItem level with the (external) ID of 'abc123' for program 12
 * ro.program(12).order.updateOrderItems('abc123', {
 *   // params
 * }, (error, data) => {
 *   // ...
 * });
 */

/**
 * Factory for creating `orders` objects.
 *
 * @param {string} contextTypeName The type of the parent context ('programs')
 * @param {number} contextId The ID of the order's parent program
 *
 * @returns {module:resources/orders~Orders} Orders object
 *
 * @example
 * // Used in the context of a program
 * const orders = ro.program(12).orders;
 */
function ordersFactory(contextTypeName, contextId) {
  const orderContext = {
    contextTypeName,
    contextId,
  };

  if (contextTypeName === 'programs') {
    return {
      ...orderContext,
      get: getOrderInContext(orderContext),
      getAll: getAllOrdersInContext(orderContext),
      getSummary: getOrderSummaryInContext(orderContext),
      create: createOrderInContext(orderContext),
      update: updateOrderInContext(orderContext),
      updateOrderItems: updateOrderItemsInContext(orderContext),
    };
  }

  throw Error('Can only create an orders object for programs');
}

/**
 * Orders object
 *
 * @typedef module:resources/orders~Orders
 *
 * @property {string} contextTypeName The type of the parent context ('programs')
 * @property {number} contextId The ID of the order's parent program
 * @property {module:resources/orders~GetFunc} get
 * @property {module:resources/orders~GetAllFunc} getAll
 * @property {module:resources/orders~GetSummaryFunc} getSummary Get summary function
 * @property {module:resources/orders~CreateFunc} create
 * @property {module:resources/orders~UpdateFunc} update
 * @property {module:resources/orders~UpdateOrderItemsFunc} updateOrderItems
 */

/**
 * Order options object
 *
 * @typedef module:resources/orders~OrderContext
 *
 * @property {string} contextTypeName The type of the parent context ('programs')
 * @property {number} contextId The ID of the order's parent program
 */

module.exports = ordersFactory;
