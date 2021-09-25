# vite-plugin-html-template

> HTML template for vite app, like html-webpack-plugin for webpack.

> It works perfectly together with [vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa).

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

- Vite needs an html entry file, which means we must have
  - projectRoot/index.html for SPA
  - projectRoot/src/pages/*/index.html for MPA
- Why not use html template for all entries
- Also we should support ejs/lodash.template syntax for the html content, like setting `<title></title>`.

## Usage

```sh
yarn add -D vite-plugin-html-template
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
// for SPA, there is nothing to do, just use `public/index.html` as template

// for MPA, customise the template path (default is `public/index.html`) and page title:
{
  // where is the pages' root directory?
  pagesDir: 'src/pages',
  // define pages like it is done in vue-cli
  pages: {
    index: {
      template: './public/index.html',
      title: 'Homepage',
    },
    subpage: {
      template: './src/pages/subpage/index.html',
      title: 'Subpage',
    },
  },
  // expose to template
  data: {
    title: 'Homepage',
  },
}
```

- [see more](https://github.com/IndexXuan/vite-plugin-html-template/blob/main/src/lib/options.ts)


## Underlying
- Thanks to [vite-plugin-virtual-html](https://github.com/Windson1806/vite-plugin-virtual-html)
- Thanks to [vite-plugin-vue-cli](https://github.com/IndexXuan/vite-plugin-vue-cli/blob/main/src/index.ts#L165)


## Further
- [vue-cli-plugin-vite](https://github.com/IndexXuan/vue-cli-plugin-vite)
- [vite-plugin-mpa](https://github.com/IndexXuan/vite-plugin-mpa)
