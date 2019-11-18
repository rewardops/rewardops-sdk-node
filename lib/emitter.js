/* Copyright 2019 RewardOps */
'use strict';

var config        = require('./config').getAll(),
    EventEmitter  = require('events').EventEmitter,
    emitter       = new EventEmitter();

if (config.maxListeners) {
  emitter.setMaxListeners(config.maxListeners);
}

module.exports = emitter;

