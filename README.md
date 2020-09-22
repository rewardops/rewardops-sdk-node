## RewardOps Node SDK

The RewardOps Node SDK dramatically simplifies OAuth as well as typical interfacing with our public APIs. Simply add your `clientId` and `clientSecret` to the config and you're ready to go.

_Note: The SDK currently supports v4 and v3 of the RewardOps API. In addition, v5 endpoints are partially implemented._

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

## Usage

### Configuration

The following properties must be set before making any API calls using the SDK:

- `clientId`: Your RewardOps API OAuth client_id.
- `clientSecret`: Your RewardOps API OAuth client_secret.

For example, in your application initialization module, you can add:

```js
const RO = require('rewardops-sdk');

RO.config.set('clientId', 'abcdefg1234567');
RO.config.set('clientSecret', '9876543poiuytr');
```

NOTE: If your program is configured to use geographic-specific PII storage, you must also set:

- `piiServerUrl`: Geographic-specific PII storage server URL.
- `supportedLocales`: List of accepted locales for the program (RFC2616 format).

```js
RO.config.set('piiServerUrl', 'https://api.ca.rewardops.net');
RO.config.set('supportedLocales', ['en-CA', 'en-FR']);
```

See the `config` module in [the SDK library documentation](https://rewardops.github.io/rewardops-sdk-node/) for all config options.

#### Environment variables

To change the RewardOps host API URL, you can optionally set the environment variable `REWARDOPS_ENV` before starting your application. (See the `api` module of [the library documentation](https://rewardops.github.io/rewardops-sdk-node/) for more info.)

You can also change the base API URL after loading the SDK using `RO.config.set('apiServerUrl', '[your-server-url]')`.

### Overview

When you make a call to the API using the SDK, the SDK will automatically use an existing valid bearer token if it has already received one. Otherwise, it will request one from the API and cache it for further use.

Several SDK methods can receive `options` objects, which then passed directly to the RewardOps API calls. Available parameters can be viewed on [RewardOps API console](https://app.rewardops.net/api_docs/console). As a rule, path parameters (e.g., required `program`, `reward`, and `order` IDs) are passed as the first argument to SDK methods, while other parameters should appear in an `options` object.

In addition, most methods accept a callback function, whose type definition can be found in the `api` module of [the library documentation](https://rewardops.github.io/rewardops-sdk-node/).

### Example methods

#### Programs

```js
// Get a list of all programs available to you
RO.programs.getAll(callback);

// Get details of a program
RO.programs.get(123, callback);
```

#### Program

The program object has methods for accessing the program's rewards, orders, and more:

```js
//  Return a program object for the program with the specified `id`
const myProgram = RO.program(123); // Standard program
const myProgram = RO.program(123, 'example_program_code'); // Geographic-specific PII storage-enabled program

// Get details for program 123
// Alias of `RO.programs.get(123)`
myProgram.details(callback);

// Get a list of all orders for a member in a program
// NOTE: The `options` object is required and must include a `member_id`.
myProgram.orders.getAll(options, callback)
// Gets the order with ID 'qwerty1234'
myProgram.orders.get('qwerty1234' callback);
// Post a new order for the reward with id 45231 for member 'bbdd0987'
// NOTE: The `options` object is required and must include a `reward_id` and a `member` object
myProgram.orders.create(
  {
    member: {
      id: 'jb0987',
      full_name: 'Jolanta Banicki',
      email: 'jolanta.b@example.com',
    },
  },
  callback
);

// Get JSON for the customCategory with code CAT_000002
myProgram.customCategories.get('CAT_000002', callback);

// Get JSON for the item with ID 938
myProgram.items.get(938, callback);
```

_This is a subset of the available methods. For the complete SDK API, see [the library documentation](https://rewardops.github.io/rewardops-sdk-node/)._

## Maintainer

Shane Martin <[shane.martin@rewardops.com](mailto:shane.martin@rewardops.com)>

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
npm run publish:docs
```
