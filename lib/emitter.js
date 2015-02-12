/* Copyright 2015 RewardOps */
'use strict';

var config        = require('./config'),
    EventEmitter  = require('events').EventEmitter,
    emitter       = new EventEmitter();

emitter.setMaxListeners(config.maxListeners);

module.exports = emitter;

