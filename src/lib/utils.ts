import type { UserOptions } from './options'
import { promises as fs } from 'fs'
import { template } from 'lodash'

/** read original template content */
async function readHtmlTemplate(templatePath: string) {
  return await fs.readFile(templatePath, { encoding: 'utf8' })
}

/** patch original content with vite entry esmodule script */
export async function getHtmlContent(
  templatePath: string,
  pageName: string,
  pages: Required<UserOptions>['pages'],
  base: string,
  url: string,
  extraData: Record<string, any>,
) {
  let content = ''
  const isMPA = Object.keys(pages).length > 0
  const entryJsPath = (() => {
    if (url === '/') {
      if (isMPA) {
        return '/src/pages/index/main'
      } else {
        return '/src/main'
      }
    } else {
      if (isMPA) {
        return `/src/pages/${pageName}/main`
      } else {
        return '/src/pages/index/main'
      }
    }
  })()
  try {
    content = await readHtmlTemplate(templatePath)
  } catch (e) {
    console.error(e)
  }
  content = content.replace(
    '<div id="app"></div>',
    `<div id="app"></div>\n    <script type="module" src="${entryJsPath}"></script>`,
  )
  const title = pages[pageName]?.title || 'page title'
  const compiled = template(content)
  const data = {
    // @see https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
    // for compatibility
    htmlWebpackPlugin: {
      options: {
        title,
      },
      tags: {
        headTags: [],
        bodyTags: [],
      },
      files: {
        publicPath: base,
        js: [],
        css: [],
        manifest: '',
        favicon: '',
      },
    },
    // for compatibility
    webpackConfig: {
      name: title,
      output: {
        publicPath: base,
      },
    },
    // @see https://cli.vuejs.org/guide/html-and-static-assets.html#html
    BASE_URL: base,
    // envs
    ...process.env,
    ...extraData,
  }
  const html = compiled({
    ...data,
  })
  return html
}
