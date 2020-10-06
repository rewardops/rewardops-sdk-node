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
// NOTE: config.sdk.supportedLocales and config.sdk.piiServerUrl are PII-specific values.
RO.config.init(config.sdk);

const program = RO.program(config.program.programId, config.program.programCode);

// create order
util
  .promisify(program.orders.create)(payloads.requests.createOrderPii)
  .then(response => {
    console.log('response :>> ', JSON.stringify(response, undefined, 2));
  })
  .catch(error => console.log(JSON.stringify(error, undefined, 2)));
