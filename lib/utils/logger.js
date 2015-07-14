/* Copyright 2015 RewardOps */
'use strict';

var config = require('./../config');

// If the config option `verbose` is `true`,
// log the argument. Otherwise, do nothing.
function logger(arg) {
  if (config.verbose) {
    return console.log(arg);
  }
}

module.exports = logger;

