/**
 * Rewards resources
 *
 * @module resources/rewards
 * @copyright 2015–2023 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

const getInputErrorMessage = (parameterName, parameterType) =>
  `must pass the ${parameterName} ${parameterType} in the params object to \`coupons.postValidate()\``;

/**
 * Checks if a coupon is valid or not.
 *
 * @param {{owner_type: string, owner_code: string, coupon_code: string, external_member_id: string, items: Array<object>}} params Request params.
 * @param {{Function}} callback function to be called after getting an API response
 *
 * @protected
 */
function postValidate(params, callback) {
  let error;
  let errorMessage;
  const { coupon_preflight: couponPreflight, accept_language: acceptLanguage } = params;

  // Argument validations.
  if (typeof params !== 'object') {
    errorMessage = 'a params object is required';
  } else if (typeof couponPreflight !== 'object') {
    errorMessage = getInputErrorMessage('coupon preflight', 'object');
  } else if (typeof couponPreflight.owner_type !== 'string') {
    errorMessage = getInputErrorMessage('owner type', 'string');
  } else if (typeof couponPreflight.owner_code !== 'string') {
    errorMessage = getInputErrorMessage('owner code', 'string');
  } else if (typeof couponPreflight.coupon_code !== 'string') {
    errorMessage = getInputErrorMessage('coupon code', 'string');
  } else if (typeof couponPreflight.external_member_id !== 'string') {
    errorMessage = getInputErrorMessage('member id', 'string');
  } else if (!Array.isArray(couponPreflight.items)) {
    errorMessage = getInputErrorMessage('items', 'array');
  } else if (acceptLanguage !== undefined && typeof acceptLanguage !== 'string') {
    errorMessage = getInputErrorMessage('accept language', 'string');
  }

  if (errorMessage) {
    error = new Error();

    error.message = errorMessage;

    callback(error);

    return;
  }

  const apiConfig = {
    ...config.getAll(),
    apiVersion: 'v5',
  };

  const options = {
    path: `/coupon_preflight`,
    config: apiConfig,
    params,
  };

  api.post(options, callback);
}

const coupons = {
  postValidate,
};

module.exports = { coupons, getInputErrorMessage };
