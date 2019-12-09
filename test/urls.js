'use strict';

var chai    = require('chai'),
    assert  = chai.assert,
    config  = require('../lib/config'),
    urls    = require('../lib/urls');

describe('urls', function() {
  var initialEnv;

  before(function() {
    initialEnv = process.env.REWARDOPS_ENV;
  });

  after(function () {
    process.env.REWARDOPS_ENV = initialEnv;

    config.reset();
  });

  describe('apiServerUrl()', function() {
    after(function () {
      config.set('apiServerUrl', undefined);
    });

    it('should have the correct server url in the development env', function() {
      process.env.REWARDOPS_ENV = 'development';

      assert.equal(urls.apiServerUrl(), 'http://localhost:3000');
    });

    it('should have the correct server url in the integration env', function() {
      process.env.REWARDOPS_ENV = 'integration';

      assert.equal(urls.apiServerUrl(), 'https://int.rewardops.net');
    });

    it('should have the correct server url in other environments', function() {
      process.env.REWARDOPS_ENV = 'production';

      assert.equal(urls.apiServerUrl(), 'https://app.rewardops.net');

      process.env.REWARDOPS_ENV = 'just some arbitrary string';

      assert.equal(urls.apiServerUrl(), 'https://app.rewardops.net');

      process.env.REWARDOPS_ENV = undefined;

      assert.equal(urls.apiServerUrl(), 'https://app.rewardops.net');
    });

    it('should return the apiServerUrl from the config if it is set', function() {
      process.env.REWARDOPS_ENV = 'development';
      config.set('apiServerUrl', 'http://example.com/test');

      assert.equal(urls.apiServerUrl(), 'http://example.com/test');
      assert.equal(urls.apiBaseUrl(), 'http://example.com/test/api/' + config.get('apiVersion'));
    });
  });

  describe('version', function() {
    it('should have the correct version at the end of the path', function() {
      config.set('apiVersion', 'v3');

      assert.equal(urls.apiBaseUrl(), urls.apiServerUrl() + '/api/v3');

      config.set('apiVersion', 'v5');

      assert.equal(urls.apiBaseUrl(), urls.apiServerUrl() + '/api/v5');

      config.set('apiVersion', 'v6-beta');

      assert.equal(urls.apiBaseUrl(), urls.apiServerUrl() + '/api/v6-beta');
    });
  });
});
