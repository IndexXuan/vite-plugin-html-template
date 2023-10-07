import type { UserOptions } from './options'
import { promises as fs } from 'fs'
import { template, last } from 'lodash'
import path from 'path'

const isWin32 = require('os').platform() === 'win32'

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
    if (isMPA) {
      // entry case: src/pages/index/main.ts or /src/pages/index/main.ts or ./src/pages/index/main.ts => /src/pages/index/main.ts
      if (pageEntry.includes('src')) {
        return `/${pageEntry.replace('/./', '/').replace('//', '/')}`
      }
      return ['/', '/index.html'].includes(extraData.url)
        ? `/${pagesDir}/index/${pageEntry}`
        : `/${pagesDir}/${pageName}/${pageEntry}`
    }
    return entry
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

export function dfs(keys: string[], value: any, res: Record<string, any>) {
  if (keys.length) {
    const strItem = keys.shift()
    if (!keys.length) {
      res[strItem!] = value
    } else {
      const tmp = res[strItem!] ? res[strItem!] : (res[strItem!] = {})
      dfs(keys, value, tmp)
    }
  }
  return res
}

export function dfs2(rebuildData: Record<string, any>, key: string, value: Record<string, any>) {
  const tmp = rebuildData[key] ? rebuildData[key] : (rebuildData[key] = {})
  if (Object.prototype.toString.call(value).slice(8, -1) === 'Object') {
    const nextKey = Object.keys(value)[0]
    dfs2(tmp, nextKey, value[nextKey])
  } else {
    rebuildData[key] = value
  }
}

export function findPageName(id: string, pageDir: string) {
  const pId = isWin32 ? id.replace(/\//g, '\\') : id
  const pDir = isWin32 ? pageDir.replace(/\//g, '\\') : pageDir
  const pathWithoutPageDir = last(path.dirname(pId).split(pDir)) || ''

  // remove leading \\ or /
  return isWin32 ? pathWithoutPageDir.replace(/^\\/, '') : pathWithoutPageDir.replace(/^\//, '')
}
