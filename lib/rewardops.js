/**
 * @copyright 2015–2019 RewardOps Inc.
 */

const api = require('./api');
const auth = require('./auth');
const config = require('./config');
const emitter = require('./emitter');
const { program, programs } = require('./resources/programs');
const { setLogFilePath } = require('./utils/logger');
const urls = require('./urls');
const { version } = require('../package');

/*
 * The RewardOps namespace
 */

/* eslint-disable global-require */
const RO = {
  api,
  auth,
  config,
  emitter,
  program,
  programs,
  setLogFilePath,
  urls,
  version,
};

module.exports = RO;
