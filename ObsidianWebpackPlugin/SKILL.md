How to configure Webpack for an Obsidian plugin

# How to Configure Webpack for an Obsidian Plugin

You can configure Webpack to bundle an Obsidian plugin into `main.js`, which Obsidian loads from `<vault>/.obsidian/plugins/<plugin-id>/`. For new plugins, Obsidian’s official sample now uses esbuild, but Webpack remains a valid option when your project already depends on its loader/plugin ecosystem or a monorepo standardizes on it.[1][2]

## Project layout

Use a dedicated development vault—Obsidian explicitly advises against developing plugins in your primary vault, because bugs can cause unintended vault changes.[1]

```text
DevVault/
└── .obsidian/
    └── plugins/
        └── obsidian-webpack-example/
            ├── main.ts
            ├── manifest.json
            ├── styles.css
            ├── package.json
            ├── tsconfig.json
            ├── webpack.config.cjs
            └── src/
                ├── settings.ts
                └── views/
                    └── dashboard-view.ts
```

The folder name must match the plugin `id` in `manifest.json`.

```text
Folder:
obsidian-webpack-example

manifest.json:
"id": "obsidian-webpack-example"
```

***

## Install dependencies

From the plugin directory:

```bash
npm init -y

npm install --save-dev \
  webpack \
  webpack-cli \
  ts-loader \
  typescript \
  @types/node \
  obsidian
```

A conservative setup places `obsidian` in `devDependencies` because its TypeScript types are needed for compilation, but Obsidian itself supplies the `obsidian` runtime module when it loads the plugin.

```bash
npm install --save-dev obsidian
```

Your production bundle must therefore mark `obsidian` as an external dependency rather than bundling it into `main.js`.

***

## `package.json`

```json
{
  "name": "obsidian-webpack-example",
  "version": "0.1.0",
  "description": "An Obsidian plugin bundled with Webpack.",
  "main": "main.js",
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "tsc --noEmit --skipLibCheck && webpack --mode production",
    "typecheck": "tsc --noEmit --skipLibCheck"
  },
  "keywords": [
    "obsidian",
    "obsidian-plugin",
    "webpack",
    "typescript"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@types/node": "^22.0.0",
    "obsidian": "latest",
    "ts-loader": "^9.5.0",
    "typescript": "^5.0.0",
    "webpack": "^5.0.0",
    "webpack-cli": "^5.0.0"
  }
}
```

### Commands

```bash
# Development watch mode with inline source maps
npm run dev
```

```bash
# Type-check and create an optimized production main.js
npm run build
```

```bash
# Type-check without building
npm run typecheck
```

The official sample plugin exposes the same high-level workflow: `npm run dev` continuously rebuilds the plugin during development, while production builds should type-check and generate a release-ready `main.js`.[1][2]

***

## `webpack.config.cjs`

```js
const path = require('node:path');

/**
 * @param {Record<string, unknown>} env
 * @param {{ mode?: 'development' | 'production' }} argv
 */
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './main.ts',

    mode: isProduction
      ? 'production'
      : 'development',

    target: 'node',

    output: {
      path: path.resolve(__dirname),
      filename: 'main.js',
      libraryTarget: 'commonjs2',
      clean: false
    },

    resolve: {
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: false
            }
          }
        }
      ]
    },

    externals: {
      obsidian: 'commonjs obsidian',
      electron: 'commonjs electron',

      '@codemirror/state':
        'commonjs @codemirror/state',
      '@codemirror/view':
        'commonjs @codemirror/view',
      '@codemirror/language':
        'commonjs @codemirror/language',

      '@lezer/common':
        'commonjs @lezer/common',
      '@lezer/highlight':
        'commonjs @lezer/highlight',
      '@lezer/lr':
        'commonjs @lezer/lr'
    },

    devtool: isProduction
      ? false
      : 'inline-source-map',

    optimization: {
      minimize: isProduction
    },

    performance: {
      hints: isProduction
        ? 'warning'
        : false
    },

    stats: {
      colors: true,
      modules: false,
      assets: true
    }
  };
};
```

### Why these configuration choices?

| Option | Reason |
|---|---|
| `entry: './main.ts'` | Defines the plugin source entry point |
| `output.filename: 'main.js'` | Obsidian expects compiled plugin code in `main.js` |
| `libraryTarget: 'commonjs2'` | Matches the CommonJS-style plugin runtime loading model |
| `target: 'node'` | Matches Obsidian’s Electron/Node-oriented runtime |
| `externals.obsidian` | Prevents bundling Obsidian’s provided API module |
| `externals.electron` | Prevents bundling Electron APIs |
| CodeMirror/Lezer externals | Avoids bundling APIs supplied by the Obsidian runtime |
| `inline-source-map` in development | Maps DevTools stack traces to TypeScript source |
| `minimize` in production | Reduces output size and improves load time |
| `clean: false` | Avoids accidentally removing `manifest.json` or `styles.css` in the plugin folder |

Obsidian recommends shipping a production build and considering minification, because plugins are loaded before users can interact with the app; smaller bundles reduce disk-read and load costs.[3]

***

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "lib": [
      "DOM",
      "ES2022"
    ],
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "inlineSourceMap": true,
    "inlineSources": true
  },
  "include": [
    "main.ts",
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "main.js",
    "dist",
    "release"
  ]
}
```

`noEmit: true` lets TypeScript validate the code while Webpack owns output generation.

***

## `manifest.json`

```json
{
  "id": "obsidian-webpack-example",
  "name": "Obsidian Webpack Example",
  "version": "0.1.0",
  "minAppVersion": "1.5.0",
  "description": "An Obsidian plugin built with TypeScript and Webpack.",
  "author": "Your Name",
  "authorUrl": "https://example.invalid",
  "isDesktopOnly": false
}
```

When you change `manifest.json`, restart Obsidian rather than merely rebuilding the TypeScript source. Obsidian’s official build guide specifically notes that manifest updates require an app restart to take effect.[1]

***

## `main.ts`

```ts
import {
  Notice,
  Plugin
} from 'obsidian';

export default class ObsidianWebpackExamplePlugin extends Plugin {
  async onload(): Promise<void> {
    this.addRibbonIcon(
      'package-check',
      'Show Webpack plugin status',
      () => {
        new Notice(
          'This Obsidian plugin was built with Webpack.'
        );
      }
    );

    this.addCommand({
      id: 'show-webpack-plugin-status',
      name: 'Show Webpack plugin status',
      callback: () => {
        new Notice(
          `Plugin version: ${this.manifest.version}`
        );
      }
    });

    console.info(
      `[${this.manifest.id}] loaded`,
      {
        version: this.manifest.version
      }
    );
  }

  onunload(): void {
    console.info(
      `[${this.manifest.id}] unloaded`
    );
  }
}
```

After `npm run dev` produces `main.js`, enable the plugin under **Settings → Community plugins → Installed plugins**. After modifying TypeScript, reload the plugin through disable/enable or **Reload app without saving** from the Command Palette.[1]

***

## `styles.css`

Obsidian loads a sibling `styles.css` automatically if it exists. You usually do not need Webpack’s CSS loaders for a conventional Obsidian plugin.

```css
.obsidian-webpack-example-card {
  padding: 12px;
  border: 1px solid var(--background-modifier-border);
  border-radius: var(--radius-s);
  background: var(--background-secondary);
}

.obsidian-webpack-example-card__title {
  color: var(--text-normal);
  font-weight: var(--font-bold);
}

.obsidian-webpack-example-card__meta {
  color: var(--text-muted);
  font-family: var(--font-monospace);
  font-size: var(--font-smallest);
}
```

Use Obsidian CSS variables rather than fixed light-theme colors so the plugin works with dark mode and custom themes.

***

## Development workflow

```bash
cd /path/to/DevVault/.obsidian/plugins/obsidian-webpack-example
npm install
npm run dev
```

Then in Obsidian:

```text
Settings
→ Community plugins
→ Turn on community plugins
→ Enable “Obsidian Webpack Example”
```

For each TypeScript change:

```text
Webpack watch rebuilds main.js
→ Obsidian Command Palette
→ Reload app without saving
```

The official tutorial also suggests using the Hot Reload community plugin during development, though manual reload remains a reliable fallback.[1]

> [!tip]
> Keep Webpack running in a separate terminal. When builds fail, do not reload Obsidian until the compilation error is fixed—otherwise you may keep executing an older `main.js`.

***

## Source maps and debugging

For development:

```js
devtool: 'inline-source-map'
```

This lets DevTools map errors in `main.js` back to your TypeScript source.

Open Developer Tools:

```text
Windows/Linux: Ctrl + Shift + I
macOS: Cmd + Option + I
```

For release builds:

```js
devtool: false
```

This reduces distribution size and avoids accidentally exposing source comments, local paths, or embedded development constants through source-map files.

***

## Defer expensive startup work

Webpack configuration affects bundle size, but plugin startup behavior matters just as much. Keep `onload()` limited to registrations:

```ts
async onload(): Promise<void> {
  this.addCommand({
    id: 'open-dashboard',
    name: 'Open dashboard',
    callback: async () => {
      await this.openDashboard();
    }
  });

  this.registerView(
    'my-dashboard-view',
    (leaf) => new DashboardView(leaf, this)
  );
}
```

Defer expensive index creation, network calls, or large vault scans:

```ts
async onload(): Promise<void> {
  this.app.workspace.onLayoutReady(() => {
    void this.initializeIndex();
  });
}
```

Obsidian advises keeping `onload()` limited to necessary initialization and registrations. It specifically recommends `workspace.onLayoutReady()` for startup work that can safely be deferred; vault `create` event handlers should also wait until layout readiness to avoid reacting to initial vault initialization events.[3]

***

## Optional path aliases

### Add aliases to `webpack.config.cjs`

```js
resolve: {
  extensions: ['.ts', '.js'],
  alias: {
    '@core': path.resolve(__dirname, 'src/core'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@views': path.resolve(__dirname, 'src/views'),
    '@ui': path.resolve(__dirname, 'src/ui')
  }
}
```

### Mirror them in `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": [
        "src/core/*"
      ],
      "@services/*": [
        "src/services/*"
      ],
      "@views/*": [
        "src/views/*"
      ],
      "@ui/*": [
        "src/ui/*"
      ]
    }
  }
}
```

Then use:

```ts
import {
  VaultWriteService
} from '@services/vault-write-service';
```

> [!warning]
> Both TypeScript and Webpack must know about the alias. Adding it to only one configuration causes either compile-time or runtime resolution errors.

***

## Security constraints

Never inject credentials through Webpack configuration.

### Do not do this

```js
const webpack = require('webpack');

new webpack.DefinePlugin({
  'process.env.API_KEY': JSON.stringify(
    process.env.API_KEY
  )
});
```

That value can be embedded permanently in `main.js`.

### Safe build metadata

```js
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    __PLUGIN_VERSION__: JSON.stringify(
      process.env.npm_package_version ?? 'development'
    )
  })
]
```

```ts
declare const __PLUGIN_VERSION__: string;

console.info({
  pluginVersion: __PLUGIN_VERSION__
});
```

Safe candidates for build-time constants:

- Plugin version
- Build mode
- Public commit identifier
- Non-sensitive feature defaults

Never embed:

- API keys
- OAuth client secrets
- JWT signing keys
- Database credentials
- Private webhook secrets
- Supabase service-role keys
- User tokens

***

## Release checklist

```text
Build
[ ] npm run typecheck passes
[ ] npm run build passes
[ ] main.js is generated in production mode
[ ] main.js is minified
[ ] source maps are intentionally excluded or reviewed

Runtime
[ ] manifest.json has a unique ID
[ ] plugin directory matches manifest ID
[ ] main.js is present
[ ] manifest.json is present
[ ] styles.css is present if used
[ ] obsidian is externalized
[ ] electron is externalized
[ ] CodeMirror/Lezer packages are externalized if imported

Performance
[ ] onload() only registers commands, views, settings and processors
[ ] expensive startup work uses onLayoutReady()
[ ] no full-vault scan runs during startup
[ ] optional features are deferred

Security
[ ] no `.env` file in release artifact
[ ] no secret injected through DefinePlugin
[ ] no API key in `main.js`
[ ] no local/private test data in source maps or logs
[ ] dependencies are reviewed and locked
```

## Prefer esbuild unless needed

The official Obsidian sample plugin currently uses an esbuild configuration and a `dev`/`build` script structure. Therefore, if Webpack is not required for your project, starting from the official sample template is simpler and generally faster.[1][2]

```bash
git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
cd obsidian-sample-plugin
npm install
npm run dev
```

Use Webpack when it provides a concrete benefit; otherwise, use the official esbuild starter and invest effort in plugin lifecycle, safe vault writes, metadata indexing, UI quality, and load-time performance.

การอ้างอิง:
[1] Build a plugin - Developer Documentation https://docs.obsidian.md/Plugins/Getting%20started/Build%20a%20plugin
[2] obsidian-sample-plugin/package.json at master · obsidianmd/obsidian-sample-plugin https://github.com/obsidianmd/obsidian-sample-plugin/blob/master/package.json
[3] Optimize plugin load time - Developer Documentation https://docs.obsidian.md/plugins/guides/load-time
