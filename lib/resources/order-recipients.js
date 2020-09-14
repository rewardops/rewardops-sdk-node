/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */
const axios = require('axios');
const { at } = require('lodash');

const config = require('../config');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

const debugLogs = [];
const getV5Token = async () =>
  axios.post(
    `${config.get('piiServerUrl')}/api/v5/auth/token`,
    {
      grant_type: 'client_credentials',
    },
    {
      auth: {
        username: config.get('clientId'),
        password: config.get('clientSecret'),
      },
    }
  );

const createOrder = orderContext => async (params, callback) => {
  debugLogs.push({ function: 'createOrder', params });
  try {
    const response = await axios.post(
      `${config.get('piiServerUrl')}/api/v4/programs/${orderContext.contextId}/orders`,
      params
    );
    callback(null, response.data, response);
  } catch (error) {
    callback({ error, debugLogs });
  }
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
    .then(async () => {
      try {
        const {
          data: { access_token: accessToken },
        } = await getV5Token();
        debugLogs.push({ function: 'storeOrderRecipient.getV5Token', accessToken });
        axios.defaults.headers.common.Authorization = accessToken;
      } catch (error) {
        debugLogs.push({ function: 'storeOrderRecipient.getV5Token', error });
        // eslint-disable-next-line no-throw-literal
        throw { errors: { error, debugLogs } };
      }

      try {
        const response = await axios.post(
          `${config.get('piiServerUrl')}/api/v5/programs/${orderContext.programCode}/order_recipients`,
          member
        );
        callback(null, response.data, response);
      } catch (error) {
        debugLogs.push({
          function: 'storeOrderRecipient.createOrderRecipients',
          errors: at(error, ['response.data', 'request', 'message']),
        });
        // eslint-disable-next-line no-throw-literal
        throw { errors: { error, debugLogs } };
      }
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
