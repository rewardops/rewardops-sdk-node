# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.4.0](https://github.com/rewardops/rewardops-sdk-node/compare/v2.2.0...v2.4.0) (2021-01-19)

### Features

- add new cancelOrders function MX-1339 ([#64](https://github.com/rewardops/rewardops-sdk-node/issues/64)) ([f6fd846](https://github.com/rewardops/rewardops-sdk-node/commit/f6fd8465f8ead2b8969cd6cf58630a1c74e50e78))
- add request object to the api callback signature ([#61](https://github.com/rewardops/rewardops-sdk-node/issues/61)) ([0c0ed77](https://github.com/rewardops/rewardops-sdk-node/commit/0c0ed77ffb6539a54cad1ac022b82e548ef45c94))

### Bug Fixes

- catch all 5XX and 4XX statusCodes ([#56](https://github.com/rewardops/rewardops-sdk-node/issues/56)) ([637a5e8](https://github.com/rewardops/rewardops-sdk-node/commit/637a5e841368e4b721e77567414cbd54eff9a732))
- create instance of axios for PII calls MX-1388 ([#57](https://github.com/rewardops/rewardops-sdk-node/issues/57)) ([1ac41cf](https://github.com/rewardops/rewardops-sdk-node/commit/1ac41cf48bdbca1673df2051360a5d3e107d3476))

## [2.3.0](https://github.com/rewardops/rewardops-sdk-node/compare/v2.2.0...v2.3.0) (2021-01-05)

### Features

- add request object to the api callback signature ([#61](https://github.com/rewardops/rewardops-sdk-node/issues/61)) ([0c0ed77](https://github.com/rewardops/rewardops-sdk-node/commit/0c0ed77ffb6539a54cad1ac022b82e548ef45c94))

### Bug Fixes

- catch all 5XX and 4XX statusCodes ([#56](https://github.com/rewardops/rewardops-sdk-node/issues/56)) ([637a5e8](https://github.com/rewardops/rewardops-sdk-node/commit/637a5e841368e4b721e77567414cbd54eff9a732))
- create instance of axios for PII calls MX-1388 ([#57](https://github.com/rewardops/rewardops-sdk-node/issues/57)) ([1ac41cf](https://github.com/rewardops/rewardops-sdk-node/commit/1ac41cf48bdbca1673df2051360a5d3e107d3476))

## [2.2.0](https://github.com/rewardops/rewardops-sdk-node/compare/v2.1.0...v2.2.0) (2020-10-30)

### Features

- **perf:** make all create order calls directly to global API ([177bb4b](https://github.com/rewardops/rewardops-sdk-node/commit/177bb4b60039b824b2d9c1e9a6299d1d8164a309))
- make config errors more descriptive ([d62ffd8](https://github.com/rewardops/rewardops-sdk-node/commit/d62ffd8f23841d17c463908e61cda07ccf9fe67e))

## [2.1.0](https://github.com/rewardops/rewardops-sdk-node/compare/v2.0.0...v2.1.0) (2020-10-27)

### Features

- redact PII in log output ([2d29b71](https://github.com/rewardops/rewardops-sdk-node/commit/2d29b71326e7b2e95a9a20a12f411a9102bd4e6e))

## [2.0.0](https://github.com/rewardops/rewardops-sdk-node/compare/v1.3.2...v2.0.0) (2020-10-21)

### Bug Fixes

- BREAKING CHANGE: refactor PII create to use `Orders#create` callback signature ([#52](https://github.com/rewardops/rewardops-sdk-node/issues/52)) ([b01a7df](https://github.com/rewardops/rewardops-sdk-node/commit/b01a7dfba7ac50d9a177b242b4518cc670adb582))

### [1.3.2](https://github.com/rewardops/rewardops-sdk-node/compare/v1.3.1...v1.3.2) (2020-10-16)

### Bug Fixes

- **config:** fall back on defaults if `init` given nil prop values ([#51](https://github.com/rewardops/rewardops-sdk-node/issues/51)) ([d4b6fdf](https://github.com/rewardops/rewardops-sdk-node/commit/d4b6fdfca045dd3be9f5008966aba9440b5eabb2))

### [1.3.1](https://github.com/rewardops/rewardops-sdk-node/compare/v1.3.0...v1.3.1) (2020-10-14)

### Bug Fixes

- return entire response if POST call fails ([#50](https://github.com/rewardops/rewardops-sdk-node/issues/50)) ([79c1440](https://github.com/rewardops/rewardops-sdk-node/commit/79c1440dbb05e4eba10d0e97b59424b5ee56a44e))

## [1.3.0](https://github.com/rewardops/rewardops-sdk-node/compare/v1.2.0...v1.3.0) (2020-10-09)

### Features

- add `config.init` method, with validation ([#46](https://github.com/rewardops/rewardops-sdk-node/issues/46)) ([c510eb2](https://github.com/rewardops/rewardops-sdk-node/commit/c510eb202b16fe38dda398cc6d8948f197c73408))
- improve logging throughout the SDK ([#44](https://github.com/rewardops/rewardops-sdk-node/issues/44)) ([d6bb8e1](https://github.com/rewardops/rewardops-sdk-node/commit/d6bb8e16b611c52e40bce3f9078e5bbb55d3eb2b))
  - add `quiet` prop to SDK config
  - add missing logs to new PII methods
  - add meta data output to logs in verbose mode

### Bug Fixes

- allow id to be UUID ([#45](https://github.com/rewardops/rewardops-sdk-node/issues/45)) ([1f2762f](https://github.com/rewardops/rewardops-sdk-node/commit/1f2762f3d81474e9adcc935e61f473745c115d23))

## [1.2.0](https://github.com/rewardops/rewardops-sdk-node/compare/v1.0.2...v1.2.0) (2020-09-24)

### Features

- add PII token cache ([#37](https://github.com/rewardops/rewardops-sdk-node/issues/37)) ([d3e6127](https://github.com/rewardops/rewardops-sdk-node/commit/d3e6127e9eec4940300066d32b24a37004b2e48d))

### Bug Fixes

- add missing `return` from `storeOrderRecipient` ([#38](https://github.com/rewardops/rewardops-sdk-node/issues/38)) ([1269d23](https://github.com/rewardops/rewardops-sdk-node/commit/1269d236e21cd414f1103011490ffbb5c9f0f9c5))

## [1.1.0](https://github.com/rewardops/rewardops-sdk-node/compare/v1.0.3...v1.1.0) (2020-09-16)

### Features

- add order-recipients module with `storeOrderRecipient` and `getOrderRecipient` methods ([5f77bbe](https://github.com/rewardops/rewardops-sdk-node/pull/34/commits/5f77bbe028bef9d97948a7ce208f6e9849081574); [f1e5941](https://github.com/rewardops/rewardops-sdk-node/pull/34/commits/f1e59416acaf6f52bab40f1a4cc3122be8b22ed9))
- add new `piiServerUrl` configuration property ([0f306f5](https://github.com/rewardops/rewardops-sdk-node/pull/34/commits/0f306f5f01a2047a4b0a8493be97ed8208a66d6f))
- add new `acceptedLocales` configuration property (required for programs using `piiServerUrl`) ([713169e](https://github.com/rewardops/rewardops-sdk-node/pull/34/commits/713169e8626ceb226391fc2f5283581bd6d73781))

### [1.0.2](https://github.com/rewardops/rewardops-sdk-node/compare/v1.0.0...v1.0.2) (2020-04-17)

### Bug Fixes

- correct licensing issues + other tweaks ([#27](https://github.com/rewardops/rewardops-sdk-node/issues/27)) ([ab5ed8e](https://github.com/rewardops/rewardops-sdk-node/commit/ab5ed8e95c305a29a21f935bec9373f41e68c3c4))
- remove License section ([dd71c73](https://github.com/rewardops/rewardops-sdk-node/commit/dd71c73a9816d29dae9a198f232136fa877601c7))

### [1.0.1](https://github.com/rewardops/rewardops-sdk-node/compare/v1.0.0...v1.0.1) (2019-12-17)

### Bug Fixes

- remove License section from the README ([dd71c73](https://github.com/rewardops/rewardops-sdk-node/commit/dd71c73a9816d29dae9a198f232136fa877601c7))

## [1.0.0](https://github.com/rewardops/rewardops-sdk-node/compare/v0.8.1...v1.0.0) (2019-12-05)

### ⚠ BREAKING CHANGES

- tweak public API and overhaul library docs [PAN-2721](<[#17](https://github.com/rewardops/rewardops-sdk-node/issues/17)>) ([d271cc0](https://github.com/rewardops/rewardops-sdk-node/commit/d271cc0743b83da4fde7619f0f444b87cdaa1da5))

### Bug Fixes

- package.json to reduce vulnerabilities ([df285dc](https://github.com/rewardops/rewardops-sdk-node/commit/df285dc9bd5e888d42ecc19cbeb2338986fa781d))
