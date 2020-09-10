/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

const createOrder = (storeOrderRecipientError, params, options, callback) => {
  if (storeOrderRecipientError) {
    callback(storeOrderRecipientError);
  }
  // TODO: consider adding validation see: createOrderInContext
  // see: lib/resources/orders.js
  api.post({ options, params }, (createOrderError, data, response) => {
    callback(createOrderError, data, response);
  });
};

/**
 * Higher order function for creating a `create` order function in context.
 *
 * NOTE: This is a v5 API endpoint, therefore ignores the `apiVersion` config prop
 *
 * @param {module:resources/orders~OrderContext} orderContext Order context object
 *
 * @returns {module:resources/orders~CreateFunc} `create` order function in context
 *
 * @protected
 */
const storeOrderRecipient = orderContext => async (requestBody, callback) => {
  if (!config.get('piiServerUrl')) {
    throw new Error('piiServerUrl is not configured');
  }

  const { member = {}, ...rest } = requestBody;
  const options = {
    path: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders`,
    config: config.getAll(),
  };

  await storeOrderRecipientSchema
    .validate(member)
    .then(() =>
      api.post(
        {
          customPath: `/${config.get('piiServerUrl')}/api/v5/programs/${orderContext.programCode}/order_recipients`,
          params: member,
          // internally uses v4 auth endpoint to get token, should work the same for v5
          config: config.getAll(),
        },
        (storeOrderRecipientError, piiData) =>
          createOrder(storeOrderRecipientError, { ...rest, ...piiData }, options, callback)
      )
    )
    .catch(({ errors }) => callback(errors));
};

const orderRecipientFactory = (contextTypeName, programCode) => {
  if (contextTypeName !== 'programs') {
    throw new Error('Can only create an order recipient object for programs');
  }

  const orderContext = {
    contextTypeName,
    programCode,
  };

  return {
    create: storeOrderRecipient(orderContext),
  };
};

module.exports = orderRecipientFactory;

/**
 * Default SDK configuration options type
 *
 * @typedef module:resources/orders-recipients~PiiRequestBody
 *
 * @property {string} id Member ID
 * @property {string} [accept_language] The member's preferred locale, in the format of Accept-Language
 *   as per RFC2616; e.g. `en-CA`, `en-US`
 * @property {string} [gift] Is the order a gift?
 * @property {string} [full_name] Full name
 * @property {string} [ip_address] IP address
 * @property {string} [email] Email address
 * @property {string} [phone] Phone number
 * @property {module:resources/orders-recipients~AddressModelSchema} [address] Address
 */

/**
 * RewardOps Address model schema
 *
 * @typedef module:resources/orders-recipients~AddressModelSchema
 *
 * @property {string} address Street address
 * @property {string} address_2 Street address - 2
 * @property {string} city City
 * @property {string} country_code Country code - ISO 3166-1 alpha-2
 * @property {string} country_subregion_code Country subdivision code - ISO 3166-2 alpha-2 (State/Province)
 * @property {string} postal_code Postal code (ZIP code)
 */
