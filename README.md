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


จากภาพ Repository ของคุณ ตอนนี้โปรเจกต์ agent-hub เริ่มมีโครงสร้างที่ดีแล้ว (.github, skills, app, plugins, types, README และ GitHub Actions) แต่ยังมีสิ่งที่ควรพัฒนาต่อเพื่อให้เป็น production-ready

ลำดับที่แนะนำคือ

🚀 Phase 1: Clean Repository

ลบ node_modules/ ออกจาก Git และเพิ่ม .gitignore

ย้ายไฟล์ Dashboard/PDF/รูปภาพ ไปไว้ใน docs/ หรือ assets/

แยก examples/ สำหรับไฟล์ตัวอย่าง


โครงสร้างที่แนะนำ

agent-hub/
├── .github/
├── .gemini/
├── app/
├── core/
├── skills/
├── plugins/
├── docs/
├── assets/
├── scripts/
├── tests/
├── packages/
└── README.md


---

⚙️ Phase 2: CI/CD

เพิ่ม Workflow

✅ ci.yml

✅ codeql.yml

✅ dependency-review.yml

✅ secret-scan.yml

✅ release.yml

✅ docs.yml



---

🧪 Phase 3: Testing

เพิ่ม

Vitest/Jest

Playwright

Coverage Report

Codecov



---

📦 Phase 4: Package

npm package

Dockerfile

docker-compose.yml

Dev Container

GitHub Codespaces



---

☸️ Phase 5: Cloud

Kubernetes manifests

Helm Chart

Terraform

Vercel deployment

Supabase integration



---

🤖 Phase 6: AI Features

จากที่เห็นมีโฟลเดอร์ skills/ แล้ว แนะนำเพิ่ม

MCP Server

Brave Skills

Gemini CLI integration

Claude Code support

OpenAI Agents SDK

Plugin Marketplace



---

📊 Phase 7: Monitoring

Prometheus

Grafana

OpenTelemetry

Sentry

Telegram notifications



---

สิ่งที่ควรทำ "วันนี้"

1. ลบ node_modules ออกจาก Git


2. เพิ่ม .gitignore


3. เพิ่ม ci.yml


4. เพิ่ม CodeQL


5. เพิ่ม Secret Scan


6. จัดโครงสร้าง docs/


7. เขียน CONTRIBUTING.md


8. เพิ่ม LICENSE


9. ตั้ง GitHub Releases


10. ตั้ง Semantic Versioning



หลังจากนั้น Repository จะพร้อมสำหรับการพัฒนาแบบทีมและการเปิดเป็น Open Source มากขึ้น.
