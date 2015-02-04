/* Copyright 2015 RewardOps */
'use strict';

var orders  = require('./resources/orders');

/*
 * Return a context object, i.e., either a Brand object or a Program object.
 *
 * @param {string} contextType - The context type ('brand' or 'program')
 *
 * @constructor
 */

function context(contextType, id) {
  return {
    context: contextType,
    id: id,
    orders: orders(contextType, id)
  };
}

module.exports = context;

