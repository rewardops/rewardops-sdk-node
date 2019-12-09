## RewardOps Node SDK

Note: The SDK currently supports v4 and v3 of the RewardOps API.

## Installation

### NPM

To use the SDK in your Node.js project:

```sh
npm install @rewardops/sdk-node
```

To install and save a specific (legacy) version of the SDK in your package.json, use a version tag in the Git URL:

```sh
npm install --save git+ssh://git@github.com:rewardops/rewardops-sdk-node.git#v0.4.6
```

## Configuration

### Required

- `clientId`: Your RewardOps API OAuth client_id.
- `clientSecret`: Your RewardOps API OAuth client_secret.

You must set `RO.config.clientId` and `RO.config.clientSecret` before making any API calls using the SDK.

```js
const RO = require('rewardops-sdk');

RO.config.set('clientId', 'abcdefg1234567');
RO.config.set('clientSecret', '9876543poiuytr');
```

See [the SDK library documentation](https://rewardops.github.io/rewardops-sdk-node/) for all config options.

### Environment variables

You can optionally set the environment variable `REWARDOPS_ENV` before starting your application to change the root RewardOps API URL to which the SDK will make requests. See

You can also change the base API URL after loading the SDK using `RO.config.set('apiServerUrl', '[your-server-url]')`.

## Documentation

### SDK API

See [the library documentation](https://rewardops.github.io/rewardops-sdk-node/) for the complete SDK API.

### OAuth

The SDK dramatically simplifies OAuth. You only need to add your `clientId` and `clientSecret` to the config and you're ready to go. When you make a call to the API using the SDK, the SDK will automatically use an existing valid bearer token if it has already received one. Otherwise, it will request one from the API and store it for later use.

### Samples

To see the SDK in action, look at the server for the [RewardOps sample JavaScript app](https://github.com/rewardops/rewardops-sample-javascript).

To see an application that uses the SDK to consume the RewardOps API, see the [RewardOps Angular Catalog app](https://github.com/rewardops/rewardops-angular-catalog), which uses the SDK in its Express server.

## Maintainer

Shane Martin <[shane.martin@rewardops.com](mailto:shane.martin@rewardops.com)>

## License

Copyright (c) 2015-2019 RewardOps Inc.

All rights reserved.

---

## Contributing

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

NOTE: This section is for developers maintaining the `rewardops-sdk-node` library, rather than those consuming the npm package.

**This repository uses [semantic versioning](https://semver.org/), [conventional commits](https://www.conventionalcommits.org) and [the `standard-version` library](https://github.com/conventional-changelog/standard-version#readme) for versioning and changelog documentation. Ensure that you are familiar with those before contributing.**

Use [`nvm`](https://github.com/nvm-sh/nvm/) or check `.nvmrc` for expected Node version.

Install:

```sh
npm install
```

To run the library test suite:

```sh
npm test
```

To build the documentation locally:

```sh
npm run build:docs
```

To publish a new version, in a new `release/*` branch, run:

```sh
npm run release
# review CHANGELOGS for accuracy
# follow console output from the `release` script
```
