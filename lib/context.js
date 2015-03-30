/* Copyright 2015 RewardOps */
'use strict';

var orders  = require('./resources/orders');

/*
 * Return a context object, i.e., a program object.
 *
 * @param {string} contextType - The context type ('program')
 * @param {number} id - The id for the context
 *
 * @returns {object}
 */

function context(contextType, id) {
  return {
    context: contextType,
    id: id,
    orders: orders(contextType, id)
  };
}

module.exports = context;

