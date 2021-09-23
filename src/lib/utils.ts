import type { UserOptions } from './options'
import { promises as fs } from 'fs'
import { template } from 'lodash'

/** read original template content */
async function readHtmlTemplate(templatePath: string) {
  return await fs.readFile(templatePath, { encoding: 'utf8' })
}

interface Payload {
  pagesDir: string
  pageName: string
  templatePath: string
  pageEntry: string
  pageTitle: string
  isMPA: boolean
  data: UserOptions['data']
  entry: UserOptions['entry']
  extraData: {
    base: string
    url: string
  }
}

/** patch original content with vite entry esmodule script */
export async function getHtmlContent(payload: Payload) {
  const {
    pagesDir,
    templatePath,
    pageName,
    pageTitle,
    pageEntry,
    isMPA,
    data,
    entry,
    extraData,
  } = payload
  let content = ''
  const entryJsPath = (() => {
    // entry case: src/pages/index/main.ts or /src/pages/index/main.ts or ./src/pages/index/main.ts => /src/pages/index/main.ts
    if (['/', '/index.html'].includes(extraData.url)) {
      if (isMPA) {
        return pageEntry.includes('src')
          ? `/${pageEntry.replace('/./', '/').replace('//', '/')}`
          : `/${pagesDir}/index/${pageEntry}`
      } else {
        return entry
      }
    } else {
      if (isMPA) {
        return pageEntry.includes('src')
          ? `/${pageEntry.replace('/./', '/').replace('//', '/')}`
          : `/${pagesDir}/${pageName}/${pageEntry}`
      } else {
        return entry
      }
    }
  })()
  try {
    content = await readHtmlTemplate(templatePath)
  } catch (e) {
    console.error(e)
  }
  content = content.replace(
    '</body>',
    `  <script type="module" src="${entryJsPath}"></script>\n</body>`,
  )
  const compiled = template(content)
  const context = {
    // @see https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates
    // for compatibility
    htmlWebpackPlugin: {
      options: {
        title: pageTitle,
      },
      tags: {
        headTags: [],
        bodyTags: [],
      },
      files: {
        publicPath: extraData.base,
        js: [],
        css: [],
        manifest: '',
        favicon: '',
      },
    },
    // for compatibility
    webpackConfig: {
      name: pageTitle,
      output: {
        publicPath: extraData.base,
      },
    },
    /** page title, both SPA & MPA supported */
    title: pageTitle,
    // @see https://cli.vuejs.org/guide/html-and-static-assets.html#html
    BASE_URL: extraData.base,
    // envs
    ...process.env,
    ...data,
  }
  const html = compiled({
    ...context,
  })
  return html
}
