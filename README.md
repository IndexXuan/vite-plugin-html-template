# vite-plugin-html-template

> use html template for vite serve, like HtmlWebpackPlugin with public/index.html

<p align="center">
  <a href="https://github.com/IndexXuan/vite-plugin-html-template/actions/workflows/npm-publish.yml">
   <img alt="NPM Publish" src="https://github.com/IndexXuan/vite-plugin-html-template/actions/workflows/npm-publish.yml/badge.svg" style="max-width:100%;">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-html-template" rel="nofollow">
    <img alt="downloads" src="https://img.shields.io/npm/dt/vite-plugin-html-template.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-html-template" rel="nofollow">
    <img alt="npm version" src="https://img.shields.io/npm/v/vite-plugin-html-template.svg?style=flat" style="max-width:100%;">
  </a>
  <a href="https://github.com/IndexXuan/vite-plugin-html-template/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" style="max-width:100%;">
  </a>
</p>

## Motivation

- Vite need html for entry file, which means we must have projectRoot/index.html for SPA and projectRoot/src/pages/*/index.html for MPA
- Why not we use html template for all entry html

## Usage

```sh
yarn add vite-plugin-html-template
```

```ts
// vite.config.ts
import htmlTemplate from 'vite-plugin-html-template'

// @see https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...other plugins
    htmlTemplate(/* options */),
  ],
})
```

## Options

```ts
{
  /** is MPA or not */
  mpa: boolean
}
```

- [see more](https://github.com/IndexXuan/vite-plugin-html-template/blob/main/src/lib/options.ts)

## Examples
- see [src/examples](https://github.com/IndexXuan/vite-plugin-html-template/blob/main/examples)

- use shelljs after-build to organize dist folder, maybe have better approach (help wanted)

## Underlying
- Thanks to [vite-plugin-virtual-html](https://github.com/Windson1806/vite-plugin-virtual-html)
- Thanks to [vite-plugin-vue-cli](https://github.com/IndexXuan/vite-plugin-vue-cli/blob/main/src/index.ts#L165)


## Further
- [vue-cli-plugin-vite](https://github.com/IndexXuan/vue-cli-plugin-vite)
