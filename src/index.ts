import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite'
import type { UserOptions } from './lib/options'
import path from 'path'
import shell from 'shelljs'
import { last } from 'lodash'
import { getHtmlContent } from './lib/utils'
import { name } from '../package.json'

const resolve = (p: string) => path.resolve(process.cwd(), p)
// must src to corresponding with vite-plugin-mpa#closeBundle hook
const PREFIX = 'src'

export default function htmlTemplate(userOptions: UserOptions = {}): Plugin {
  const options = {
    pages: {},
    ...userOptions,
  }
  let config: ResolvedConfig
  const isMPA = Object.keys(options.pages).length > 0
  return {
    name,
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    /**
     * for dev
     * if SPA, just use template and write script main.{js,ts} for /{entry}.html
     * if MPA, check pageName(default is index) and write /src/pages/{pageName}/${entry}.html
     */
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        // if not html, next it.
        if (!req.url?.endsWith('.html') && req.url !== '/') {
          return next()
        }
        let url = req.url
        const pageName = (() => {
          if (url === '/') {
            return 'index'
          }
          return url.match(/pages\/(.*)\//)?.[1] || 'index'
        })()
        const templateOption = options.pages && options.pages[pageName]?.template
        const templatePath = templateOption ? resolve(templateOption) : resolve('public/index.html')
        const content = await getHtmlContent(
          templatePath,
          pageName,
          options.pages,
          config.base,
          url,
          options.data || {},
        )
        res.end(content)
      })
    },
    /**
     * virtual html
     * @see {@link https://github.com/rollup/plugins/blob/master/packages/virtual/src/index.ts}
     */
    resolveId(id) {
      if (id.endsWith('.html')) {
        if (!isMPA) {
          return `${PREFIX}/${path.basename(id)}`
        } else {
          const pageName = last(path.dirname(id).split('/')) || ''
          if (pageName in options.pages) {
            return `${PREFIX}/pages/${pageName}/index.html`
          }
        }
      }
      return null
    },
    load(id) {
      if (id.startsWith(PREFIX)) {
        const idNoPrefix = id.slice(PREFIX.length)
        const pageName = path.basename(id).replace('.html', '')

        const templateOption = options.pages && options.pages[pageName]?.template
        const templatePath = templateOption ? resolve(templateOption) : resolve('public/index.html')
        return getHtmlContent(
          templatePath,
          pageName,
          options.pages,
          config.base,
          isMPA ? idNoPrefix : '/',
          options.data || {},
        )
      }

      return null
    },
    closeBundle() {
      // MPA is handle by vite-plugin-mpa
      if (!isMPA) {
        const root = config.root || process.cwd()
        const dest = (config.build && config.build.outDir) || 'dist'
        const resolve = (p: string) => path.resolve(root, p)

        // 1. move src/*.html to dest root
        shell.mv(resolve(`${dest}/${PREFIX}/*.html`), resolve(dest))
        // 2. remove empty src dir
        shell.rm('-rf', resolve(`${dest}/${PREFIX}`))
      }
    },
  }
}

export type { UserOptions as HtmlTemplateOptions }
