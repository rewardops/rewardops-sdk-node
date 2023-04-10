/**
 * Rewards resources
 *
 * @module resources/rewards
 * @copyright 2015–2023 RewardOps Inc.
 */

const config = require('../config');
const api = require('../api');

/**
 * Checks if a coupon is valid or not.
 *
 * @param {{owner_type: string, owner_code: string, coupon_code: string, external_member_id: string, items: Array<object>}} params Request params.
 * @param {{Function}} callback function to be called after getting an API response
 *
 * @protected
 */
function validate(params, callback) {
  let error;
  let errorMessage;

  // Argument validations.
  if (typeof params !== 'object') {
    errorMessage = 'A params object is required';
  } else if (typeof params.owner_type !== 'string') {
    errorMessage = 'must pass the owner type string in the params object to `coupons.postValidate()`';
  } else if (typeof params.owner_code !== 'string') {
    errorMessage = 'must pass the owner code string in the params object to `coupons.postValidate()`';
  } else if (typeof params.coupon_code !== 'string') {
    errorMessage = 'must pass a coupon code string in the params object to `coupons.postValidate()`';
  } else if (typeof params.external_member_id !== 'string') {
    errorMessage = 'must pass the member id string in the params object to `coupons.postValidate()`';
  } else if (!Array.isArray(params.items)) {
    errorMessage = 'must pass an items array in the params object to `coupons.postValidate()`';
  }

  if (errorMessage) {
    error = new Error();

    error.message = errorMessage;

    callback(error);

    return;
  }

  const options = {
    path: `/coupon_preflight`,
    config: config.getAll(),
    params,
  };

  api.post(options, callback);
}

/**
 * Factory for coupon objects.
 *
 * @returns {{validate: validate}}
 *   Returns `validate` coupon function.
 *
 */
function couponsFactory() {
  return {
    validate,
  };
}

module.exports = couponsFactory;
