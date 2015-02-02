'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    programs  = require('../../lib/resources/programs.js');

describe('RewardOps', function() {
  describe('programs', function() {
    it('should be an object', function() {
      expect(programs).to.be.an('object');
    });

    describe('getAll()', function() {
      it('should return an array', function(done) {
        programs.getAll(function(error, programList) {
          expect(error).to.equal(null);

          expect(programList).to.be.an('array');

          done();
        });
      });
    });
  });
});

