/**
 * Personalization resources
 *
 * @module resources/order-recipients
 * @copyright 2015–2023 RewardOps Inc.
 */
const axios = require('axios');

const config = require('../config');
const { setPiiToken } = require('../utils/axios-helpers');
const { log } = require('../utils/logger');

const piiServerClient = axios.create();

/**
 *
 * @param {string} programCode pangea program code
 * @returns {*} registerMemberTags function
 */
function Personalization(programCode) {
  /**
   *
   * @param {*} member consists of foreign_id, segment, member_tags, program_code
   * @param callback
   * @returns {string} memberUUID
   */
  const registerMemberTags = async (member, callback) => {
    try {
      await setPiiToken(piiServerClient);
      const url = `${config.get('piiServerUrl')}/api/v5/programs/${programCode}/members`;

      log('Request: POST {url}\nPayload: {member}', { data: { url, member } });

      const {
        data: { result },
      } = await piiServerClient.post(url, member);
      callback(null, null, result);
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      callback(error, undefined, undefined);
    }
  };

  return { registerMemberTags };
}

module.exports = Personalization;
