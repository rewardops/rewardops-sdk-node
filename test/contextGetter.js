'use strict';

var chai          = require('chai'),
    expect        = chai.expect,
    contextGetter = require('../lib/contextGetter.js');

describe('contextGetter', function() {
  it('should create a brands object', function() {
    var brands = contextGetter('brands');

    expect(brands).to.be.an('object');
  });

  it('should create a programs object', function() {
    var programs = contextGetter('programs');

    expect(programs).to.be.an('object');
  });

  it('should create an object with the corrext context property', function() {
    var brands = contextGetter('brands'),
        programs = contextGetter('programs');

    expect(brands.context).to.equal('brands');
    expect(programs.context).to.equal('programs');
  });
});

