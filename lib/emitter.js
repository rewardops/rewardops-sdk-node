/* Copyright 2019 RewardOps */

const { EventEmitter } = require('events');

const config = require('./config').getAll();

const emitter = new EventEmitter();

if (config.maxListeners) {
  emitter.setMaxListeners(config.maxListeners);
}

module.exports = emitter;
