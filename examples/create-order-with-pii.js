/**
 * Example of creating an item order within a PII-enabled program.
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

/** Set up RewardOps SDK configuration */
const setSDKConfig = () => {
  // standard setup
  RO.config.set('apiServerUrl', config.sdk.apiServerUrl);
  RO.config.set('apiVersion', config.sdk.apiVersion);
  RO.config.set('clientId', config.sdk.clientId);
  RO.config.set('clientSecret', config.sdk.clientSecret);

  // PII-specific setup
  RO.config.set('supportedLocales', config.sdk.supportedLocales);
  RO.config.set('piiServerUrl', config.sdk.piiServerUrl);
};

/** Main  */
async function main() {
  setSDKConfig();

  // set the program
  const program = RO.program(config.program.programId, config.program.programCode);

  // get an example program item
  const {
    items: [item],
  } = await util.promisify(program.items.getAll)({ per_page_count: 1 });
  // console.log('item :>> ', JSON.stringify(item, undefined, 2));

  const orderItem = {
    item_order_token: item.supplier_items[0].order_token,
    quantity: 1,
    member_spend: [
      {
        currency_code: config.program.currencyCode,
        amount: item.supplier_items[0].prices.regular_price[config.program.currencyCode],
      },
    ],
  };

  // create order
  const orderRequestPayload = { ...payloads.requests.createOrderPii, items: [orderItem] };
  await util
    .promisify(program.orders.create)(orderRequestPayload)
    .then(response => {
      console.log('response :>> ', JSON.stringify(response, undefined, 2));
    })
    .catch(error => console.log(JSON.stringify(error, undefined, 2)));
}

main();
