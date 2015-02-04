'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    context = require('../lib/context.js');

describe('context', function() {
  it('should create a brand object', function() {
    var brand = context('brand');

    expect(brand).to.be.an('object');
  });

  it('should create a programs object', function() {
    var program = context('program');

    expect(program).to.be.an('object');
  });

  it('should create an object with the corrext context property', function() {
    var brand = context('brand'),
        program = context('program');

    expect(brand.context).to.equal('brand');
    expect(program.context).to.equal('program');
  });
});

