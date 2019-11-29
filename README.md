[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## RewardOps Node SDK

Note: The SDK currently supports v4 and v3 of the RewardOps API.

## Installation

### NPM

To use the SDK in your Node.js project:

```sh
npm install @rewardops/rewardops-sdk-node
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

See [the library documentation](FIXME) for all config options.

### Environment variables

You can optionally set the environment variable `REWARDOPS_ENV` before starting your application to change the root RewardOps API URL to which the SDK will make requests. See

You can also change the base API URL after loading the SDK using `RO.config.set('apiServerUrl', '[your-server-url]')`.

## Documentation

### SDK API

See [the library documentation](FIXME) for the complete SDK API.

### OAuth

The SDK dramatically simplifies OAuth. You only need to add your `clientId` and `clientSecret` to the config and you're ready to go. When you make a call to the API using the SDK, the SDK will automatically use an existing valid bearer token if it has already received one. Otherwise, it will request one from the API and store it for later use.

### Samples

To see the SDK in action, look at the server for the [RewardOps sample JavaScript app](https://github.com/rewardops/rewardops-sample-javascript).

To see an application that uses the SDK to consume the RewardOps API, see the [RewardOps Angular Catalog app](https://github.com/rewardops/rewardops-angular-catalog), which uses the SDK in its Express server.

## Development

### Installation

```sh
git clone https://github.com/rewardops/rewardops-sdk-node.git

cd rewardops-sdk-node

nvm use # recommended; see https://github.com/nvm-sh/nvm/

npm install
```

## Maintainer

Shane Martin <[shane.martin@rewardops.com](mailto:shane.martin@rewardops.com)>

## License

Copyright (c) 2015-2019 RewardOps Inc.

All rights reserved.
