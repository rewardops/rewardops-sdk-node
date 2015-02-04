'use strict';

var chai        = require('chai'),
    expect      = chai.expect,
    packageJSON = require('../package'),
    RO          = require('../');

describe('RO', function() {
  describe('config', function() {
    it('should have a config property', function() {
      expect(RO.config).to.be.an('object');
    });
  });

  describe('version', function() {
    it('should have a version property', function() {
      expect(RO.version).to.be.a('string');
    });

    it('should be the same version number as in package.json', function() {
      expect(RO.version).to.equal(packageJSON.version);
    });
  });
});

