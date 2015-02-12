'use strict';

var chai      = require('chai'),
    expect    = chai.expect,
    api       = require('../lib/api'),
    fixtures  = require('./fixtures/apiFixtures');

describe('api', function() {
  /* jshint camelcase: false */

  before(function() {
    fixtures();
  });

  it('should be an object', function() {
    expect(RO.api).to.be.an('object');
  });
  
  it('should pass an AuthorizationError to the callback when it receives an AuthenticationError from RO.auth.getToken()', function(done) {
    var config = {
      client_id: null,
      client_secret: null 
    };

    RO.api.get('/testForAuthError', config, function(error, data, response) {
      expect(error.name).to.equal('AuthenticationError');

      expect(data).to.equal(undefined);
      expect(response).to.equal(undefined);

      done();
    });
  });

  it('should request a new token and retry when the server responds that the attempted token is invalid', function(done) {
    // Implementation note:
    //
    // When the server responds that the token is invalid,
    // fire an "invalidateToken" event. Then, call RO.auth.getToken()
    // with the API call as the callback.
    //
    // Calls to RO.auth.getToken() first check whether RO.auth.tokenLocked()
    // returns `true`. If it does, the callback passed to RO.auth.getToken() is
    // added as a listener to the 'newToken' event.
    //
    // If it doesn't return true, call lockToken(),
    // which sets the local var
    // `tokenLocked` to true. (This is read by RO.auth.tokenLocked().
    // Subsequent calls then wait for the new token, per the above.)
    // Then make a call to the oauth2 server for
    // a new token as usual.
    //
    // All of this is to avoid a race condition where mutiple
    // calls for a new token happen at once, making all but
    // the last return immediately invalidated tokens.
    //
    var expires = new Date(),
        badToken = 'HeresAToken123456789',
        goodToken = 'apiTestToken1234',
        config = {client_id: 'mockedclientidforprogramstests', client_secret: 'mockedclientsecretforprogramstests'},
        badScope = nock(RO.urls.baseUrl + '/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + badToken
          }
        })
          .get('/arbitrary-path')
          .reply(401, null, {
            'Www-Authenticate': 'Bearer realm=\"api.rewardops.net\", error=\"invalid_token\", error_description=\"The access token expired\"',
            'Content-Type': 'text/html'
          }),
        goodScope = nock(RO.urls.baseUrl + '/some', {
          reqheaders: {
            'Authorization': 'Bearer ' + goodToken
          } 
        })
          .get('/arbitrary-path')
          .reply(200, {result: 'OK'}),
        authScope = nock(RO.auth.baseUrl)
          .post(RO.auth.tokenPath, _.extend(config, {grant_type: 'client_credentials'}))
          .reply(200, {
            'access_token': goodToken,
            'created_at': Math.round(+new Date()/1000),
            'expires_in': 7200
          }),
        listenerWasFired = false;

    expires.setHours(expires.getHours() + 2);

    emitter.on('invalidateToken', function() {
      listenerWasFired = true;
    });

    RO.config = config;

    RO.auth.token = {
      access_token: badToken,
      expires: expires
    };

    RO.api.get('/some/arbitrary-path', config, function(error, result) {
      expect(error).to.equal(null);
      expect(result).to.equal('OK');

      expect(badScope.isDone()).to.be.ok();
      expect(goodScope.isDone()).to.be.ok();
      expect(authScope.isDone()).to.be.ok();
      expect(RO.auth.token.access_token).to.equal('apiTestToken1234');
      expect(listenerWasFired).to.equal(true);

      done();
    });
  });

  describe('get', function() {
    it('should be a function', function() {
      expect(RO.api.get).to.be.a('function');
    });

    it('should make an HTTP GET request to the url provided', function(done) {
      var config = {
        client_id: 'abcdefg1234567',
        client_secret: 'abcdefg1234567'
      };

      RO.api.get('/someTestPath', config, function(error, programs) {
        expect(error).to.equal(null);

        expect(programs).to.be.an('array');

        done();
      });
    });

    xit('should accept an optional options object and pass it on to the request() call', function(done) {
       done();
    });

    it('should pass a third argument to the callback that is the full JSON body of the API response', function(done) {
      var config = {
        client_id: 'abcdefg1234567',
        client_secret: 'abcdefg1234567'
      };

      RO.api.get('/someTestPath', config, function(error, programs, response) {
        expect(error).to.equal(null);

        expect(response).to.be.an('object');
        expect(response.status).to.equal('OK');

        done();
      });
    });
  });
});

