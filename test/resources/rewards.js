'use strict';

var chai    = require('chai'),
    expect  = chai.expect,
    Rewards = require('../../lib/resources/rewards');

describe('Rewards', function() {
  it('should create an object', function() {
    var programId = 3470,
        rewards = new Rewards(programId);

    expect(rewards).to.be.an('object').and.to.be.an.instanceof(Rewards);
  });

  describe('programId', function() {
    it('should be the program ID passed to the constructor', function() {
      var id = 4985,
          rewards = new Rewards(id);

      expect(rewards.programId).to.be.a('number').and.to.equal(id);
    });
  });

  describe('getAll()', function() {
    it('should return an array to the callback', function(done) {
      var rewards = new Rewards(67);

      rewards.getAll(function(error, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('array');

        done();
      });
    });
  });

  describe('get()', function() {
    it('should return an object to the callback', function(done) {
      var rewards = new Rewards(3209);

      rewards.get(1654, function(error, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');

        done();
      });
    });
  });

  describe('create()', function() {
    it('should return an object to the callback', function(done) {
      var rewards = new Rewards(2994);

      rewards.create({}, function(error, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');

        done();
      });
    });
  });
});
