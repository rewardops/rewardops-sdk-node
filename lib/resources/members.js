/**
 * Favourites(retaillers) resources
 *
 * @module resources/members
 * @copyright 2015–2023 RewardOps Inc.
 */

const { isEmpty } = require('lodash');
const config = require('../config');
const api = require('../api');
const { log } = require('../utils/logger');

/**
 *
 */
function apiConfig() {
  return {
    ...config.getAll(),
    apiVersion: 'v5',
  };
}

/**
 * @param path
 * @param params
 */
function requestOptions(path, params = undefined) {
  const options = {
    path,
    config: apiConfig(),
  };

  if (!isEmpty(params)) {
    options.params = params;
  }

  return options;
}

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 * @protected
 */
const addToFavourites = (programCode, memberUUID) => {
  /**
   *
   * @param {object} params
   * @param {module:api~requestCallback} callback Callback that handles the response
   */
  return function addNewFavorite(params, callback) {
    if (typeof params !== 'object' || isEmpty(params)) {
      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(new Error('A params object is required'));

      return;
    }

    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/favourites`;
      const options = requestOptions(reqPath, params);

      api.post(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 */
const removeFromFavourites = (programCode, memberUUID) => {
  return (params, callback) => {
    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/favourites`;
      const options = requestOptions(reqPath, params);

      api.delete(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 */
const addToWishlist = (programCode, memberUUID) => {
  return function addNewWish(params, callback) {
    if (typeof params !== 'object' || isEmpty(params)) {
      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(new Error('A params object is required'));

      return;
    }

    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/wishlist`;
      const options = requestOptions(reqPath, params);

      api.post(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 */
const removeFromWishlist = (programCode, memberUUID) => {
  return (params, callback) => {
    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/wishlist`;
      const options = requestOptions(reqPath, params);

      api.delete(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 */
const getShoppingCart = (memberUUID, programCode) => {
  /**
   *
   * @param {object} params
   * @param {module:api~requestCallback} callback Callback that handles the response
   */
  return function shoppingCart(params, callback) {
    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/cart`;
      const options = requestOptions(reqPath, params);

      api.get(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @param {string} memberUUID PII identificator
 * @returns {*} function
 * @protected
 */
const updateShoppingCart = (programCode, memberUUID) => {
  /**
   *
   * @param {object} params
   * @param {module:api~requestCallback} callback Callback that handles the response
   */
  return function updateCart(params, callback) {
    if (typeof params !== 'object' || isEmpty(params)) {
      if (arguments.length === 1 && typeof params === 'function') {
        callback = params;
      }

      callback(new Error('A params object is required'));

      return;
    }

    try {
      const reqPath = `/programs/${programCode}/members/${memberUUID}/cart/item`;
      const options = requestOptions(reqPath, params);

      api.post(options, callback);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error);
    }
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @returns {*} memberFactory function
 */
const memberFactory = programCode => {
  return memberUUID => ({
    programCode,
    memberUUID,
    favourites: {
      addItem: addToFavourites(programCode, memberUUID),
      removeItem: removeFromFavourites(programCode, memberUUID),
    },
    wishlist: {
      addItem: addToWishlist(programCode, memberUUID),
      removeItem: removeFromWishlist(programCode, memberUUID),
    },
    cart: {
      getCart: getShoppingCart(memberUUID, programCode),
      updateCart: updateShoppingCart(programCode, memberUUID),
    },
  });
};

module.exports = memberFactory;
