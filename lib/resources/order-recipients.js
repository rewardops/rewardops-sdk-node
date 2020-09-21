/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */
const axios = require('axios');
const { get } = require('lodash');

const config = require('../config');
const { setV5Token } = require('../utils/auth');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

const debugLogs = [];

const createOrder = ({ contextId }) => async (params, callback) => {
  debugLogs.push({ function: 'createOrder', params });
  try {
    const response = await axios.post(`${config.get('piiServerUrl')}/api/v4/programs/${contextId}/orders`, params);
    callback(null, response.data, response);
  } catch (error) {
    callback({ error, debugLogs });
  }
};

/**
 * Higher order function for creating an order recipient in context.
 *
 * NOTE: This is a v5 API endpoint, therefore ignores the `apiVersion` config prop
 *
 * @param {module:resources/orders~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders~CreateFunc} `create` order function in context
 *
 * @private
 */
const storeOrderRecipient = ({ programCode }) => async member => {
  await storeOrderRecipientSchema.validate(member).then(async () => {
    try {
      await setV5Token();
    } catch (error) {
      debugLogs.push({ function: 'storeOrderRecipient.getV5Token', error });
      // eslint-disable-next-line no-throw-literal
      throw { errors: { error, debugLogs } };
    }

    try {
      const {
        data: { result },
      } = await axios.post(`${config.get('piiServerUrl')}/api/v5/programs/${programCode}/order_recipients`, member);
      return result;
    } catch (error) {
      debugLogs.push({
        function: 'storeOrderRecipient.createOrderRecipients',
        error: get(error, 'response.data'),
      });
      // eslint-disable-next-line no-throw-literal
      throw { errors: { error, debugLogs } };
    }
  });
};

/**
 * Higher order function for fetching an order recipient in context.
 *
 * NOTE: This is a v5 API endpoint, therefore ignores the `apiVersion` config prop
 *
 * @param {module:resources/orders~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders~CreateFunc} `create` order function in context
 *
 * @public
 */
const getOrderRecipient = ({ programCode }) => async (orderRecipientCode, callback) => {
  try {
    await setV5Token();
    const { data } = await axios.get(
      `${config.get('piiServerUrl')}/api/v5/programs/${programCode}/order_recipients/${orderRecipientCode}`
    );
    callback(null, data.result, data);
  } catch (error) {
    callback(error);
  }
};

const orderRecipientFactory = (contextTypeName, contextId, programCode) => {
  if (contextTypeName !== 'programs') {
    throw new Error('Can only create an order recipient object for programs');
  }
  if (!config.get('piiServerUrl')) {
    throw new Error('piiServerUrl is not configured');
  }
  if (!config.get('supportedLocales')) {
    throw new Error('supportedLocales is not configured');
  }

  const orderContext = {
    contextTypeName,
    contextId,
    programCode,
  };

  return {
    getOrderRecipient: getOrderRecipient(orderContext),
    create: async ({ member, ...rest }, callback) => {
      try {
        const orderRecipientData = await storeOrderRecipient(orderContext)(member);
        await createOrder(orderContext)({ ...rest, ...orderRecipientData }, callback);
      } catch (exception) {
        callback(exception.errors || exception);
      }
    },
  };
};

module.exports = orderRecipientFactory;

/**
 * Default SDK configuration options type
 *
 * @typedef module:resources/orders-recipients~PiiRequestBody
 *
 * @property {string} id Member ID
 * @property {string} accept_language The member's preferred locale, in the format of Accept-Language
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

/**
 * Order options object
 *
 * @typedef module:resources/orders-recipients~V5OrderContext
 *
 * @property {string} contextTypeName The type of the parent context ('programs')
 * @property {number} contextId The ID of the order's parent program
 * @property {string} programCode The Code of the order's parent program
 */
