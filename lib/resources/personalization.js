/**
 * Personalization resources
 *
 * @module resources/order-recipients
 * @copyright 2015–2023 RewardOps Inc.
 */
const axios = require('axios');
const { get } = require('lodash');

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
   * @returns {string} memberUUID
   */
  const registerMemberTags = async member => {
    try {
      await setPiiToken(piiServerClient);
      const url = `${config.get('piiServerUrl')}/api/v5/programs/${programCode}/members`;

      log('Request: POST {url}\nPayload: {member}', { data: { url, member } });

      const {
        data: { result },
      } = await piiServerClient.post(url, member);
      return result;
    } catch (error) {
      log('API Error: {error}', { level: 'error', data: { error } });
      // eslint-disable-next-line no-throw-literal
      throw { error: get(error, 'response', error) };
    }
  };

  return { registerMemberTags };
}

module.exports = Personalization;
