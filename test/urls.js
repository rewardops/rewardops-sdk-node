'use strict';

var chai    = require('chai'),
    assert  = chai.assert,
    urls    = require('../lib/urls');

describe('urls', function() {
  it('should be an object', function() {
    assert.typeOf(urls, 'object');
  });

  describe('getBaseUrl()', function() {
    var initialEnv;

    before(function() {
      initialEnv = process.env.REWARDOPS_ENV;
    });

    after(function () {
      process.env.REWARDOPS_ENV = initialEnv;

      urls.setEnv();
    });

    it('should be the correct value in the development env', function() {
      process.env.REWARDOPS_ENV = 'development';
      urls.setEnv();

      assert.equal(urls.getBaseUrl(), 'http://localhost:3000/api/v3');
    });

    it('should be the correct value in the integration env', function() {
      process.env.REWARDOPS_ENV = 'integration';
      urls.setEnv();

      assert.equal(urls.getBaseUrl(), 'https://int.rewardops.net/api/v3');
    });

    it('should be the correct value in other environments', function() {
      process.env.REWARDOPS_ENV = 'production';
      urls.setEnv();

      assert.equal(urls.getBaseUrl(), 'https://app.rewardops.net/api/v3');

      process.env.REWARDOPS_ENV = 'just some arbitrary string';
      urls.setEnv();

      assert.equal(urls.getBaseUrl(), 'https://app.rewardops.net/api/v3');

      process.env.REWARDOPS_ENV = undefined;
      urls.setEnv();

      assert.equal(urls.getBaseUrl(), 'https://app.rewardops.net/api/v3');
    });
  });

  describe('setBaseUrl()', function() {
    var initialEnv;

    before(function() {
      initialEnv = process.env.REWARDOPS_ENV;
    });

    after(function () {
      process.env.REWARDOPS_ENV = initialEnv;

      urls.setEnv();
    });

    it('should correctly set the baseUrl', function() {
      var url = 'http://someDomain.com/api/whatev';

      urls.setBaseUrl(url);

      assert.equal(urls.getBaseUrl(), url);
    });
  });
});

