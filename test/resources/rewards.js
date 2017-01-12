'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    nock      = require('nock'),
    RO        = require('../..'),
    fixtures  = require('../fixtures/rewardsFixtures');

describe('RO.program()', function() {
  /* jshint camelcase: false */

  before(function() {
    fixtures();
  });

  describe('rewards', function() {
    var id = 33,
        program = RO.program(id);

    before(function() {
      RO.config.client_id = 'rewardTest123';
      RO.config.client_secret = 'itsATestGetUsedToIt';
    });

    after(function() {
      RO.config.client_id = undefined;
      RO.config.client_secret = undefined;
    });

    it('should be an object', function() {
      expect(program.rewards).to.be.an('object');
    });

    it('should have the correct program ID', function() {
      expect(program.rewards.programId).to.equal(id);
    });

    describe('getAll()', function() {
      it('should pass an array to the callback', function(done) {
        nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .get('/programs/33/rewards')
          .reply(200, {
            result: []
          });

        program.rewards.getAll(function(error, data) {
          expect(data).to.be.an('array');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
        .get('/programs/12/rewards')
          .reply(200, {
            result: []
          });

        RO.program(12).rewards.getAll(function(error, rewardList) {
          expect(error).to.equal(null);

          expect(rewardList).to.be.an('array');
          expect(apiCall.isDone()).to.be.true;

          done();
        });
      });

      it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
        var body = {
              page: 7,
              per_page_count: 50
            },
            scope = nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
            .get('/programs/55/rewards')
            .reply(200, {
              result: []
            });

        RO.program(55).rewards.getAll(body, function(error, rewardsList) {
          expect(error).to.equal(null);

          expect(rewardsList).to.be.an('array');
          expect(scope.isDone()).to.be.true;

          done();
        });
      });
    });

    describe('get()', function() {
      it('should pass an object to the callback', function(done) {
        nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
          .get('/programs/33/rewards/555')
          .once()
          .reply(200, {
            result: {}
          });

        program.rewards.get(555, function(error, data) {
          expect(data).to.be.an('object');

          done();
        });
      });

      it('should make an HTTP get request to the correct URL', function(done) {
        var apiCall = nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
              .get('/programs/12/rewards/929')
              .once()
              .reply(200, {
                result: {}
              });

        RO.program(12).rewards.get(929, function(error, rewardList) {
          expect(error).to.equal(null);

          expect(rewardList).to.be.an('object');
          expect(apiCall.isDone()).to.be.true;

          done();
        });
      });

      it('should accept an optional body object and pass it on to the RO.api.get() call', function(done) {
        var body = {
              member_id: '5432'
            },
            scope = nock(RO.urls.getBaseUrl(), {
              reqHeaders: {
                'Authorization': 'Bearer abcd1234rewardTime'
              }
            })
            .get('/programs/55/rewards/234', body)
            .reply(200, {
              result: []
            });

        RO.program(55).rewards.get(234, body, function(error, rewardsList) {
          expect(error).to.equal(null);

          expect(rewardsList).to.be.an('array');
          expect(scope.isDone()).to.be.true;

          done();
        });
      });
    });
  });
});
