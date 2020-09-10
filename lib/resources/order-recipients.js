/**
 * Orders Recipients resources
 *
 * @module resources/orders-recipients
 * @copyright 2015–2020 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');
const { storeOrderRecipientSchema } = require('../schemas/store-order-recipient');

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
const storeOrderRecipient = ({ orderContext, apiClient = api }) => async (requestBody, callback) => {
  if (!config.get('piiServerUrl')) {
    throw new Error('piiServerUrl is not configured');
  }

  await storeOrderRecipientSchema
    .validate(requestBody)
    .then(() =>
      apiClient.post(
        {
          path: `/${config.get('piiServerUrl')}/api/v5/programs/${orderContext.programCode}/order_recipients`,
          requestBody,
        },
        callback
      )
    )
    .catch(({ errors }) => callback(errors));
};

module.exports = { storeOrderRecipient };

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
