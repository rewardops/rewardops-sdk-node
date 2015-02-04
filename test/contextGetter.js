'use strict';

var chai          = require('chai'),
    expect        = chai.expect,
    ContextGetter = require('../lib/contextGetter.js');

describe('ContextGetter', function() {
  it('should create a brands object', function() {
    var brands = new ContextGetter('brands');

    expect(brands).to.be.an('object').and.to.be.an.instanceof(ContextGetter);
    expect(brands.context).to.equal('brands');
  });

  it('should create a programs object', function() {
    var programs = new ContextGetter('programs');

    expect(programs).to.be.an('object').and.to.be.an.instanceof(ContextGetter);
  });

  it('should create an object with the corrext context property', function() {
    var brands = new ContextGetter('brands'),
        programs = new ContextGetter('programs');

    expect(brands.context).to.equal('brands');
    expect(programs.context).to.equal('programs');
  });
});

