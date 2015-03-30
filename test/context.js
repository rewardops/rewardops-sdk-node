'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    context = require('../lib/context.js');

describe('context', function() {
  it('should create a programs object', function() {
    var program = context('program');

    expect(program).to.be.an('object');
  });

  it('should create an object with the corrext context property', function() {
    var program = context('program');

    expect(program.context).to.equal('program');
  });
});

