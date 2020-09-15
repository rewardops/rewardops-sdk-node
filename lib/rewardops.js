const api = require('./api');
const auth = require('./auth');
const config = require('./config');
const emitter = require('./emitter');
const { program, programs } = require('./resources/programs');
const { setLogFilePath } = require('./utils/logger');
const urls = require('./urls');
const { version } = require('../package');

/**
 * RewardOps Node SDK global object.
 *
 * Contains the entire public toolkit for the Node SDK, including configuration, authorization, and API request methods.
 *
 * For API request methods, all `params` parameters are passed directly to the RewardOps API. Available parameters
 * can be viewed on the [RewardOps API console](https://api.rewardops.net/api_docs/console). As a rule, path parameters
 * (i.e., required `program`, `reward`, and `order` IDs) are passed as the first argument to SDK methods, while other
 * parameters should appear in a `params` object.
 *
 * @type {object}
 *
 * @property {module:api~api} api API call helper object.
 * @property {module:auth~auth} auth Authorization token properties and actions object.
 * @property {module:config~config} config SDK configurations object.
 * @property {module:emitter~emitter} emitter Event emitter instance.
 * @property {module:resources/programs~program} program Get a `program` object for the program with the specified `id`.
 * @property {module:resources/programs~programs} programs A program-specific context type object with `getAll` and `get` methods.
 * @property {module:utils/logger~setLogFilePath} setLogFilePath Sets the path for the log file and enable file logging.
 * @property {module:urls} urls All exports from the `url` module.
 * @property {string} version RewardOps Node SDK package version.
 *
 * @copyright 2015–2020 RewardOps Inc.
 */
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
