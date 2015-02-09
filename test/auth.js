'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    RO        = require('../'),
    fixtures  = require('./fixtures/authFixtures');

describe('RO.auth', function() {
  before(function() {
    fixtures();
  });

  it('should pass an AuthenticationError to the callback when config.clientId isn\'t present', function(done) {
    var config = {
      clientId: null,
      clientSecret: 'abcdefg1234567'
    };

    RO.auth.getToken(config, function(error, response) {
      expect(error).to.be.an('object');
      expect(response).to.equal(undefined);

      expect(error.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('You must provide a clientId');

      done();
    });
  });

  it('should pass an AuthenticationError to the callback when config.clientSecret isn\'t present', function(done) {
    var config = {
      clientId: '1234567abcdefg',
      clientSecret: null
    };

    RO.auth.getToken(config, function(error, response) {
      expect(error).to.be.an('object');
      expect(response).to.equal(undefined);

      expect(error.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('You must provide a clientSecret');

      done();
    });
  });

  it('should pass an AuthenticationError to the callback when config.clientId and config.clientSecret aren\'t present', function(done) {
    var config = {
      clientId: null,
      clientSecret: null
    };

    RO.auth.getToken(config, function(error, response) {
      expect(error).to.be.an('object');
      expect(response).to.equal(undefined);

      expect(error.name).to.equal('AuthenticationError');
      expect(error.message).to.equal('You must provide a clientId and clientSecret');

      done();
    });
  });
});

