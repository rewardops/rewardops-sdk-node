# RewardOps Node.js SDK

Note: The SDK currently only uses v3 of the RewardOps API.

## Installation

### NPM

To use the SDK in your Node.js project:

```
npm install --save git+ssh://git@bitbucket.org:RewardOps/rewardops-sdk-node.git
```

To install and save a specific version of the SDK in your package.json, use a version tag in the Git URL:

```
npm install --save git+ssh://git@bitbucket.org:RewardOps/rewardops-sdk-node.git#v0.3.1
```

### Git

If you just want to get the SDK repo without adding it to a project:

```
git clone git@bitbucket.org:RewardOps/rewardops-sdk-node.git

cd rewardops-sdk-node

npm install
```

## Config

### Required

client_id

client_secret

You must set `rewardops.config.client_id` and `rewardops.config.client_secret` before making any API calls using the SDK.

```
var rewardops = require('rewardops-sdk');

rewardops.config.client_id = 'abcdefg1234567';
rewardops.config.client_secret = '9876543poiuytr';
```

### Optional

timeout

maxListeners

### Environment variables

You can optionally set the environment variable `REWARDOPS_ENV` before starting your application to change the root RewardOps API URL to which the SDK will make requests.

- `production` (default): 'https://app.rewardops.net/api/v3'
- `integration`: 'https://int.rewardops.net/api/v3'
- `development`: 'http://localhost:3000/api/v3'

## OAuth

## Sample

## API

*Note: Arguments in [square brackets] are optional.*

`options` objects are passed directly to the RewardOps API. Available parameters can be viewed on the [API console](https://app.rewardops.net/api_docs/console?version=v3).

Callbacks receive three arguments:

- `error`: `null` if there's no error, or an `Error` object otherwise
- `result`: The 'result' object from the API response body
- `body`: The full body of the response from the API. This includes pagination details, if present.

### Programs

#### rewardops.programs.getAll([options,] callback)

#### rewardops.programs.get(id, callback)

### Program objects

#### rewardops.program(id)

Returns a program object for the program with the specified `id`.

```
var myProgram = rewardops.program(225);
```

### Program methods

#### program.details(callback)

Alias of `rewardops.programs.get(id, callback)`

```
myProgram.details(function(error, result, body) {
  console.log(result);
});
```

### Rewards

#### program.rewards.getAll([options,] callback)

#### program.rewards.get(id, [options,] callback)

### Orders

#### program.orders.getAll([options,] callback)

#### program.orders.get(id, [options,] callback)

#### program.orders.create(options, callback)

## Maintainer

Jerad Gallinger - [jerad@rewardops.com](mailto:jerad@rewardops.com)

## Licence

Copyright (c) 2015 RewardOps

All rights reserved.