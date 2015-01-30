'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    program = require('../../lib/resources/program.js');

describe('RewardOps', function() {
  describe('program', function() {
    it('should return an object', function() {
      expect(program(1)).to.be.an('object');
    });
  });
});

