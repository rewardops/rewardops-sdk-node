'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    ro      = require('../')();

describe('RewardOps', function() {
  it('should have a config property', function() {
    expect(ro.config).to.be.an('object');
  });

  it('should have a version property', function() {
    expect(ro.version).to.be.a('string');
  });
});

