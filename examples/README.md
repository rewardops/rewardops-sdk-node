# Node SDK examples

This directory contains small scripts that outline a few examples of the Node SDK in use.

## Getting started

Inside the Node SDK's `examples/` directory,

- Copy `config.example.json` to `config.json` and add the configuration details for your RewardOps program and the SDK.
  - See the `DefaultConfig` type definition in [the `config` module documentation](https://rewardops.github.io/rewardops-sdk-node/module-config.html) for available SDK options.
- Copy `payloads.example.json` to `payloads.json` and add `request` payloads for any calls you plan to make with example scripts.
  - For example, if you are demoing `create-order-with-pii.js`, note that it uses a `createOrderPii` request body, so you'll need to add those details.
  - See [the External API Console](https://api.rewardops.net/api_docs/console) in the RewardOps Admin Console for details on request payloads.

Once the above is configured, you can run the scripts you're interested in.
