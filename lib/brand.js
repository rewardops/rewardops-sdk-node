/* Copyright 2015 RewardOps */
'use strict';

var mixin = require('./utils/mixin'),
    brands = require('./resources/brands'),
    context = require('./context');

/*
 * Return a brand object.
 *
 * @example
 *
 * // Returns a brand object for the brand with id 12
 * var myBrand = ro.brand(12);
 *
 * @param {number} id - The ID of a brand
 *
 * @returns {object}
 */

function brand(id) {
  /*
   * Alias for RO.brands.get(id)
   *
   * @param {function} callback
   */

  function details(callback) {
    return brands.get(id, callback);
  }

  return mixin({details: details}, context('brand', id));
}

module.exports = brand;

