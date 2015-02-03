'use strict';

var _             = require('underscore'),
    packageJSON   = require('../package'),
    defaultConfig = require('./config'),
    Program       = require('./resources/program'),
    programs      = require('./resources/programs');

/*
 * The RewardOps namespace
 */

var RO = {
  config: _.extend({}, defaultConfig),

  version: packageJSON.version,

  program: function(programId) {
    return new Program(programId);
  },

  programs: programs
};

module.exports = RO;

