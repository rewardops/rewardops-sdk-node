'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    config  = require('../lib/config');

describe('RewardOps', function() {
  describe('defaultConfig', function() {
    it('should be an object', function() {
      expect(config).to.be.an('object');
    });
  });
});

