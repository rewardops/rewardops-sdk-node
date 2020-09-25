# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
