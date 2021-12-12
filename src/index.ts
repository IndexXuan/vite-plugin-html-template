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
    pagesDir: 'src/pages',
    pages: {},
    data: {},
    ...userOptions,
  }
  let config: ResolvedConfig
  return {
    name,
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    /**
     * for dev
     * if SPA, just use template and write script main.{js,ts} for /{entry}.html
     * if MPA, check pageName(default is index) and write /${pagesDir}/{pageName}/${entry}.html
     */
    configureServer(server: ViteDevServer) {
      return () => {
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
            return url.match(new RegExp(`${options.pagesDir}/(.*)/`))?.[1] || 'index'
          })()
          const page = options.pages[pageName] || {}
          const templateOption = page.template
          const templatePath = templateOption
            ? resolve(templateOption)
            : resolve('public/index.html')
          const isMPA = typeof config.build.rollupOptions.input !== 'string' && Object.keys(config.build.rollupOptions.input || {}).length > 0
          let content = await getHtmlContent({
            pagesDir: options.pagesDir,
            pageName,
            templatePath,
            pageEntry: page.entry || 'main',
            pageTitle: page.title || 'Home Page',
            isMPA,
            data: options.data,
            entry: options.entry || '/src/main',
            extraData: {
              base: config.base,
              url,
            },
          })

          // using vite's transform html function to add basic html support
          content = await server.transformIndexHtml?.(url, content, req.originalUrl)

          res.end(content)
        })
      }
    },
    /**
     * for dev
     * @see {@link https://github.com/rollup/plugins/blob/master/packages/virtual/src/index.ts}
     */
    resolveId(id) {
      if (id.endsWith('.html')) {
        const isMPA = typeof config.build.rollupOptions.input !== 'string' && Object.keys(config.build.rollupOptions.input || {}).length > 0
        if (!isMPA) {
          return `${PREFIX}/${path.basename(id)}`
        } else {
          const pageName = last(path.dirname(id).split('/')) || ''
          if (pageName in (config.build.rollupOptions.input as any)) {
            return `${PREFIX}/${options.pagesDir.replace('src/', '')}/${pageName}/index.html`
          }
        }
      }
      return null
    },
    /** for dev */
    load(id) {
      if (id.startsWith(PREFIX)) {
        const idNoPrefix = id.slice(PREFIX.length)
        const pageName = path.basename(id).replace('.html', '')

        const page = options.pages[pageName] || {}
        const templateOption = page.template
        const templatePath = templateOption ? resolve(templateOption) : resolve('public/index.html')
        const isMPA = typeof config.build?.rollupOptions.input !== 'string' && Object.keys(config.build?.rollupOptions.input || {}).length > 0
        return getHtmlContent({
          pagesDir: options.pagesDir,
          pageName,
          templatePath,
          pageEntry: page.entry || 'main',
          pageTitle: page.title || 'Home Page',
          isMPA,
          extraData: {
            base: config.base,
            url: isMPA ? idNoPrefix : '/',
          },
          data: options.data,
          entry: options.entry || '/src/main',
        })
      }
      return null
    },
    /** for build */
    closeBundle() {
      const isMPA = typeof config.build?.rollupOptions.input !== 'string' && Object.keys(config.build?.rollupOptions.input || {}).length > 0
      // MPA handled by vite-plugin-mpa
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
