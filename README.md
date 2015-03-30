# RewardOps Node.js SDK

Note: The SDK currently only uses v3 of the RewardOps API.

## Installation

### NPM

To use the SDK in your Node.js project:

```
npm install --save git+ssh://git@github.com:rewardops/rewardops-sdk-node.git
```

To install and save a specific version of the SDK in your package.json, use a version tag in the Git URL:

```
npm install --save git+ssh://git@github.com:rewardops/rewardops-sdk-node.git#v0.4.1
```

### Git

If you just want to get the SDK repo without adding it to a project:

```
git clone https://github.com/rewardops/rewardops-sdk-node.git

cd rewardops-sdk-node

npm install
```

## Config

### Required

- `client_id`: Your RewardOps API v3 OAuth client_id.
- `client_secret`: Your RewardOps API v3 OAuth client_secret.

You must set `RO.config.client_id` and `RO.config.client_secret` before making any API calls using the SDK.

```js
var RO = require('rewardops-sdk');

RO.config.client_id = 'abcdefg1234567';
RO.config.client_secret = '9876543poiuytr';
```

### Optional

- `timeout`: Timeout for HTTP requests (used by Request)
- `maxListeners`: Sets maxListeners for the RO.emitter eventEmitter. (See [Node.js docs](https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n).)

### Environment variables

You can optionally set the environment variable `REWARDOPS_ENV` before starting your application to change the root RewardOps API URL to which the SDK will make requests.

- `production` (default): 'https://app.rewardops.net/api/v3'
- `integration`: 'https://int.rewardops.net/api/v3'
- `development`: 'http://localhost:3000/api/v3'

You can also change the base API URL after loading the SDK using `RO.urls.setBaseUrl()`;

## OAuth

The SDK dramatically simplifies OAuth. You only need to add your `client_id` and `client_secret` to the config and you're ready to go. When you make a call to the API using the SDK, the SDK will automatically use an existing valid bearer token if it has already received one. Otherwise, it will request one from the API and store it for later use.

## Sample

To see the SDK in action, look at the server for the [RewardOps sample JavaScript app](https://github.com/rewardops/rewardops-sample-javascript).

## SDK API

*Note: Arguments in [square brackets] are optional.*

`options` objects are passed directly to the RewardOps API. Available parameters can be viewed on the [RewardOps API console](https://app.rewardops.net/api_docs/console?version=v3). As a rule, path parameters (i.e., required program, reward and order IDs) are passed as the first argument to SDK methods, while other parameters should appear in an `options` object.

Callbacks receive three arguments:

- `error`: `null` if there's no error, or an `Error` object otherwise
- `result`: The 'result' object from the API response body
- `body`: The full body of the response from the API. This includes pagination details, if present.

### Programs

#### RO.programs.getAll([options,] callback)

Get a list of all programs available to you.

(Response may be paginated if you have many programs.)

```js
RO.programs.getAll(function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

#### RO.programs.get(id, callback)

Get details of a program.

```js
// Get details for program 123
// Alias: `RO.program(123).details()`
RO.programs.get(123, function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

### Program objects

#### RO.program(id)

Returns a program object for the program with the specified `id`. The program object has methods for accessing the program's rewards and orders.

```js
var myProgram = RO.program(225);
```

### Program methods

#### program.details(callback)

Alias of `RO.programs.get(id, callback)`

```js
var myProgram = RO.program(123);

// Get details for program 123
myProgram.details(function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

### Rewards

#### program.rewards.getAll([options,] callback)

Get a list of all rewards.

```js
// Gets a list of all running rewards for the program.

myProgram.rewards.getAll({
  status: 'running'
}, function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

#### program.rewards.get(id, [options,] callback)

Get a single reward.

```js
// Gets the reward with id 1234

myProgram.rewards.get(1234, function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

### Orders

#### program.orders.getAll(options, callback)

Get a list of all orders for a member in a program.

*Note:* The options object must include a member_id.

```js
// Gets the orders for member abc987

myProgram.orders.getAll({
  'member_id': 'abc987'
}, function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

#### program.orders.get(id, callback)

Get details of a single order.

```js
// Gets the order with id 'qwerty1234'

myProgram.orders.get('qwerty1234', function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

#### program.orders.create(options, callback)

Creates an order.

*Note:* The options object must include a reward_id and a member object.

```js
// Posts a new order for the reward with id 45231 for member 'bbdd0987'

myProgram.orders.create({
  'reward_id': 45231,
  'member': {
    'id': 'jb0987',
    'full_name': 'Jolanta Banicki',
    'email': 'jolanta.b@example.com'
  }
}, function(error, result, body) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

## Maintainer

Jerad Gallinger - [jerad@rewardops.com](mailto:jerad@rewardops.com)

## License

Copyright (c) 2015 RewardOps

All rights reserved.
