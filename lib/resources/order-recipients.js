/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */
const request = require('request');

const config = require('../config');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

const debugLogs = [];
let v5Token;
const getV5Token = callback =>
  request.post(
    {
      url: `${config.get('piiServerUrl')}/api/v5/auth/token`,
      params: {
        grant_type: 'client_credentials',
      },
      auth: {
        user: config.get('clientId'),
        pass: config.get('clientSecret'),
        sendImmediately: false,
      },
    },
    callback
  );

const createOrder = orderContext => (params, callback) => {
  debugLogs.push({ function: 'createOrder', token: v5Token });
  request.post(
    {
      url: `/${orderContext.contextTypeName}/${orderContext.contextId}/orders`,
      params,
      auth: {
        bearer: v5Token,
      },
    },
    (err, data, response) => callback(err, { ...data, debugLogs }, response)
  );
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
const storeOrderRecipient = orderContext => async (member, callback) => {
  if (!config.get('piiServerUrl')) {
    throw new Error('piiServerUrl is not configured');
  }

  await storeOrderRecipientSchema
    .validate(member)
    .then(() => {
      getV5Token((error, response, body) => {
        debugLogs.push({ function: 'storeOrderRecipient.getV5Token', error, response, body });
        if (error) {
          // eslint-disable-next-line no-throw-literal
          throw { error: { error, debugLogs } };
        }
        v5Token = response.access_token;
        request.post(
          {
            url: `${config.get('piiServerUrl')}/api/v5/programs/${orderContext.programCode}/order_recipients`,
            params: member,
            auth: {
              bearer: response.access_token,
            },
          },
          callback
        );
      });
    })
    .catch(({ errors }) => callback(errors));
};

const orderRecipientFactory = (contextTypeName, contextId, programCode) => {
  if (contextTypeName !== 'programs') {
    throw new Error('Can only create an order recipient object for programs');
  }

  const orderContext = {
    contextTypeName,
    contextId,
    programCode,
  };

  return {
    store: storeOrderRecipient(orderContext),
    create: createOrder(orderContext),
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
