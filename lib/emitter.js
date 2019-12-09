/**
 * Event emitter
 *
 * @module emitter
 * @copyright 2015–2019 RewardOps Inc.
 */

const { EventEmitter } = require('events');

const config = require('./config').getAll();

/**
 * Event emitter instance
 *
 * @type {EventEmitter}
 */
const emitter = new EventEmitter();

if (config.maxListeners) {
  emitter.setMaxListeners(config.maxListeners);
}

module.exports = emitter;
