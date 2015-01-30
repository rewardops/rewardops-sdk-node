'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    programs  = require('../../lib/resources/programs.js');

describe('RewardOps', function() {
  describe('programs', function() {
    it('should return an array', function(done) {
      programs(function(error, programList) {
        expect(programList).to.be.an('array');

        done();
      });
    });
  });
});

