'use strict';

var chai        = require('chai'),
    expect      = chai.expect,
    packageJSON = require('../package'),
    RO          = require('../'),
    Program     = require('../lib/resources/program'),
    programs    = require('../lib/resources/programs');

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

  describe('program()', function() {
    var id = 328409,
        program = RO.program(id);

    it('should return a new instance of Program with the correct program ID', function() {
      expect(program).to.be.an.instanceof(Program);

      expect(program.id).to.equal(id);
    });
  });

  describe('programs', function() {
    it('should be an alias for programs', function() {
      expect(RO.programs).to.equal(programs);
    });
  });
});

