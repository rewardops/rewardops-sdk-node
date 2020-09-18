/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */
const axios = require('axios');
const { get } = require('lodash');

const config = require('../config');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

const debugLogs = [];

/**
 * Request and set the bearer token in the `Authorization` header property in axios.
 *
 * @private
 */
const setV5Token = async () => {
  const {
    data: { access_token: accessToken },
  } = await axios.post(
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
  debugLogs.push({ function: 'storeOrderRecipient.getV5Token', accessToken });
  axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

/**
 * Higher order function for creating an order in context. Same as {@link module:resources/orders~createOrder}
 *
 * TODO: Refactor this so we don't have 2 different V3/V4 create order functions (https://rewardops.atlassian.net/browse/MX-1063)
 *
 * NOTE: This is actually something we'd regularly show, but are hiding so as to note cause confusion with
 * 2 create order functions in the SDK's public API.
 *
 * @param {module:resources/orders-recipients~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders-recipients~CreateOrderFunc} Create order function
 *
 * @private
 */
const createOrder = ({ contextId }) => async (params, callback) => {
  debugLogs.push({ function: 'createOrder', params });
  try {
    const response = await axios.post(
      `${config.get('piiServerUrl')}/api/${config.get('apiVersion')}/programs/${contextId}/orders`,
      params
    );
    callback(null, response.data, response);
  } catch (error) {
    callback({ error, debugLogs });
  }
};

/**
 * Create order in context function for V3/V4 API.
 *
 * @typedef module:resources/orders-recipients~CreateOrderFunc
 *
 * @property {object} params [Request]{@link https://github.com/request/request} params to pass to the create order API call.
 * @property {module:api~requestCallback} callback Callback that handles the response.
 *
 * @private
 */

/**
 * Higher order function for creating an order recipient in context.
 *
 * NOTE: This is a v5 API endpoint, therefore ignores the `apiVersion` {@link module:config~DefaultConfig Config}
 * property.
 *
 * @param {module:resources/orders-recipients~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders-recipients~StoreOrderRecipientFunc} `create` order function in context
 *
 * @see {@link module:resources/orders-recipients~StoreOrderRecipientFunc} for examples.
 *
 * @protected
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
 * Store order recipient function that makes a call to store data for geographic-specific
 * PII storage-enabled programs.
 *
 * @typedef module:resources/orders-recipients~StoreOrderRecipientFunc
 *
 * @property {module:resources/orders-recipients~MemberPiiRequestBody} member Member PII information
 *
 * @protected
 */

/**
 * Higher order function for creating an order that first stores geographic-specific PII information, in context.
 *
 * @param {module:resources/orders-recipients~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders-recipients~CreateOrderWithPiiStorageFunc} Create an order function that also
 * stores geographic-specific PII information.
 *
 * @see {@link module:resources/orders-recipients~CreateOrderWithPiiStorageFunc} for examples.
 */
const createOrderWithPiiStorage = ({ orderContext }) => async ({ member, ...createOrderParams }, callback) => {
  try {
    const orderRecipientData = await storeOrderRecipient(orderContext)(member);
    await createOrder(orderContext)({ ...createOrderParams, ...orderRecipientData }, callback);
  } catch (exception) {
    callback(exception.errors || exception);
  }
};

/**
 * Create order function that makes a call to store geographic-specific PII information, then
 * creates a new order along with the order recipient code generated from the first call.
 *
 * @typedef module:resources/orders-recipients~CreateOrderWithPiiStorageFunc
 *
 * @param {object} orderParams Order params
 * @param {module:resources/orders-recipients~MemberPiiRequestBody} orderParams.member Member PII information
 * @param {module:api~requestCallback} callback Callback that handles the response.
 *
 * @example
 * // Create new order for a program that has geographic-specific PII storage enabled.
 * // NOTE: Notice the second `'example_program_code'` argument on the `RO.program` method.
 * const program = RO.program(12, 'example_program_code');
 * program.order.create(
 *   {
 *     reward_id: 45231,
 *     member: {
 *       id: 'jb0987',
 *       full_name: 'Jolanta Banicki',
 *       email: 'jolanta.b@example.com',
 *     },
 *   },
 *   (error, responseBody, response) => {
 *     if (error) {
 *       console.log(error);
 *     } else {
 *       console.log(result);
 *     }
 *   }
 * );
 */

/**
 * Higher order function for fetching an order recipient in context.
 *
 * NOTE: This is a v5 API endpoint, therefore ignores the `apiVersion` config prop
 *
 * @param {module:resources/orders-recipients~V5OrderContext} v5OrderContext Order context object
 *
 * @returns {module:resources/orders-recipients~GetOrderRecipientFunc} `create` order function in context
 *
 * @see {@link module:resources/orders-recipients~GetOrderRecipientFunc} for examples.
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

/**
 * Fetch order recipient function.
 *
 * @typedef module:resources/orders-recipients~GetOrderRecipientFunc
 *
 * @property {string} orderRecipientCode Order recipient code (e.g., from a
 *   {@link module:resources/orders~GetSummaryFunc GetSummaryFunc} payload).
 * @property {module:api~requestCallback} callback Callback that handles the response.
 *
 * @example
 * // Used in the context of a program
 * const orders = ro.program(12, 'example_program_code').getOrderRecipient(
 *   'poiuytr123456',
 *   (undefined, responseBody, response) => {
 *     console.log(result);
 *   });
 */

/**
 * Factory for creating `orderRecipients` methods.
 *
 * @param {string} contextTypeName The type of the parent context ('programs')
 * @param {number} contextId The ID of the order's parent program
 * @param {string} programCode The Code of the order's parent program
 *
 * @returns {module:resources/orders~OrderRecipients} Orders object
 *
 * @protected
 */
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
    create: createOrderWithPiiStorage(orderContext),
  };
};

/**
 * Order recipients methods object
 *
 * @typedef module:resources/orders~OrderRecipients
 *
 * @property {module:resources/orders-recipients~GetOrderRecipientFunc} getOrderRecipient
 * @property {module:resources/orders-recipients~CreateFunc} create
 */

module.exports = orderRecipientFactory;

/**
 * Request body payload for Member PII information.
 *
 * @typedef module:resources/orders-recipients~MemberPiiRequestBody
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
