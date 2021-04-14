# vite-plugin-html-template

> HTML template for vite app, like html-webpack-plugin for webpack.

<p align="center">
  <img alt="wakatime" src="https://wakatime.com/badge/github/IndexXuan/vite-plugin-html-template.svg" />
  <a href="https://github.com/IndexXuan/vite-plugin-html-template/actions/workflows/npm-publish.yml">
   <img alt="NPM Publish" src="https://github.com/IndexXuan/vite-plugin-html-template/actions/workflows/npm-publish.yml/badge.svg" style="max-width:100%;">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-html-template" rel="nofollow">
    <img alt="downloads" src="https://img.shields.io/npm/dt/vite-plugin-html-template.svg">
  </a>
  <a href="https://www.npmjs.com/package/vite-plugin-html-template" rel="nofollow">
    <img alt="npm version" src="https://img.shields.io/npm/v/vite-plugin-html-template.svg" style="max-width:100%;">
  </a>
  <a href="https://github.com/IndexXuan/vite-plugin-html-template/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" style="max-width:100%;">
  </a>
</p>

## Motivation

- Vite need html for entry file, which means we must have
  - projectRoot/index.html for SPA
  - projectRoot/src/pages/*/index.html for MPA
- Why not we use html template for all entry html
- Also we should support ejs/lodash.template syntax for the html content, like setting `<title></title>`.

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

- like [vue-cli#pages](https://cli.vuejs.org/config/#pages)
```ts
// for SPA, you can do nothing, auto reuse public/index.html use template

// for MPA, you can custom template path(default is public/index.html) and page title
{
  // define pages
  pages: {
    index: {
      template: './public/index.html',
      title: 'Home Page',
    },
    subpage: {
      template: './src/pages/subpage/index.html',
      title: 'Sub Page',
    },
  },
  // expose to template
  data: {
    title: 'Home Page',
  },
}
```

- [see more](https://github.com/IndexXuan/vite-plugin-html-template/blob/main/src/lib/options.ts)


## Underlying
- Thanks to [vite-plugin-virtual-html](https://github.com/Windson1806/vite-plugin-virtual-html)
- Thanks to [vite-plugin-vue-cli](https://github.com/IndexXuan/vite-plugin-vue-cli/blob/main/src/index.ts#L165)


## Further
- [vue-cli-plugin-vite](https://github.com/IndexXuan/vue-cli-plugin-vite)
