/**
 * Create an item order within a PII-enabled program.
 *
 * Requirements:
 *
 * - Set `supportedLocales` and `piiServerUrl` config properties.
 * - Set `createOrderPii` request payload information.
 */
const util = require('util');

const RO = require('../lib/rewardops');
const config = require('./config.json');
const payloads = require('./payloads.json');

// standard setup
RO.config.set('apiServerUrl', config.apiServerUrl);
RO.config.set('apiVersion', config.apiVersion);
RO.config.set('clientId', config.clientId);
RO.config.set('clientSecret', config.clientSecret);

// PII-specific setup
RO.config.set('supportedLocales', config.supportedLocales);
RO.config.set('piiServerUrl', config.piiServerUrl);

const program = RO.program(516, 'national_australian_bank');

// PII create
util
  .promisify(program.orders.create)(payloads.requests.createOrderPii)
  .then(response => {
    console.log('response :>> ', response);
  })
  .catch(error => console.log(JSON.stringify(error, undefined, 2)));
