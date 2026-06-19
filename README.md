# agent-hub

[[CI](https://github.com/1napz/agent-hub/actions/workflows/webpack.yml/badge.svg)](https://github.com/1napz/agent-hub/actions/workflows/webpack.yml)
[[npm version](https://img.shields.io/npm/v/agent-hub.svg)](https://www.npmjs.com/package/agent-hub)
[[Coverage](https://codecov.io/gh/1napz/agent-hub/branch/main/graph/badge.svg)](https://codecov.io/gh/1napz/agent-hub)
[[License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`agent-hub` is a webpack orchestration tool for monorepos. Run webpack across every package with one command, share a base config, and override per-package when needed.

## Why agent-hub?

| Tool | Focus | Webpack-native | Config Overhead | Best For |
| --- | --- | --- |
| **Lerna** | Versioning + publishing | No | Medium | Managing releases |
| **Nx** | General build system | Plugin-based | High | Full dev platform |
| **Turborepo** | Task runner + caching | Pipeline-based | Medium | Speeding up any scripts |
| **agent-hub** | **Webpack orchestration** | **Yes** | **Low** | Webpack-heavy monorepos |

Use `agent-hub` when every package in your repo is bundled with webpack and you don’t want to adopt a full build system.

## Features
- **Monorepo-aware**: Builds all packages in parallel or dependency order
- **Unified config**: `webpack.base.js` shared across packages + per-package overrides
- **Filesystem cache**: Incremental builds for faster CI
- **Automated CI**: Tested on Node 18.x, 20.x, 22.x via GitHub Actions
- **Zero-config CLI**: `npx agent-hub build` works out of the box

## Quick Start

### Requirements
- Node.js >= 18
- npm/yarn/pnpm workspaces

### Installation
```bash
npm install agent-hub --save-dev