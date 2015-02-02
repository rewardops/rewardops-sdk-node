'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    sinon     = require('sinon'),
    program   = require('../../lib/resources/program.js'),
    programs  = require('../../lib/resources/programs.js');

describe('RewardOps', function() {
  describe('program()', function() {
    it('should return an object', function() {
      expect(program(1)).to.be.an('object');
    });

    describe('id', function() {
      it('should be the number passed as an argument to ro.program()', function() {
        expect(program(1).id).to.be.a('number');

        expect(program(1).id).to.equal(1);
        expect(program(99).id).to.equal(99);
      });
    });

    describe('details()', function() {
      it('should be an alias for ro.programs.get(program.id)', function(done) {
        sinon.stub(programs, 'get', function(id, cb) {
          cb(null, {});
        });

        program(12).details(function(error, data) {
          expect(programs.get.calledWith(12)).to.equal(true);

          done();
        });
      });
    });

    describe('orders', function() {
      it('should be an object', function() {
        expect(program(33).orders).to.be.an('object');
      });

      describe('getAll()', function() {
        it('should return an array', function(done) {
          program(67).orders.getAll(function(error, data) {
            expect(data).to.be.an('array');

            done();
          });
        });
      });
    });
  });
});

