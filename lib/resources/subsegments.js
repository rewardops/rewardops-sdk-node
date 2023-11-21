/**
 * Subsegments resources
 *
 * @module resources/subsegments
 * @copyright 2015–2023 RewardOps Inc.
 */

const { isEmpty } = require('lodash');
const config = require('../config');
const api = require('../api');

/**
 *
 */
function apiConfig() {
  return {
    ...config.getAll(),
    apiVersion: 'v5',
  };
}

/**
 * @param path
 * @param params
 */
function requestOptions(path, params = undefined) {
  const options = {
    path,
    config: apiConfig(),
  };

  if (!isEmpty(params)) {
    options.params = params;
  }

  return options;
}

const getSubsegments = programCode => {
  return function getAll(params, callback) {
    const options = requestOptions(`/programs/${programCode}/subsegments`);

    /*
     * If called with two arguments,
     * set options.params to the first
     * argument (`params`).
     *
     * Otherwise (i.e., called with just
     * one argument), set the callback as
     * the argument.
     */
    if (arguments.length === 2) {
      options.params = params;
    } else {
      options.params = {};
      callback = params;
    }

    api.get(options, callback);
  };
};

/**
 *
 * @param {string} programCode pangea program code
 * @returns {*} subsegmentsFactory object
 */
const subsegmentsFactory = programCode => ({
  programCode,
  getAll: getSubsegments(programCode),
});

module.exports = subsegmentsFactory;
