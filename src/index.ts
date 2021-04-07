import type { Plugin, ViteDevServer, ResolvedConfig } from 'vite'
import type { UserOptions } from './lib/options'
import path from 'path'
import { getHtmlTemplate } from './lib/utils'
import { template } from 'lodash'
import { name } from '../package.json'

const resolve = (p: string) => path.resolve(process.cwd(), p)

export default function htmlTemplate(userOptions: UserOptions = {}): Plugin {
  const options: UserOptions = {
    mpa: false,
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
     * if MPA, check pageName(default is index) and write /src/pages/{pageName}/${entry}.html
     * MVP: only support public/index.html
     */
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        // if not html, next it.
        if (!req.url?.endsWith('.html') && req.url !== '/') {
          return next()
        }
        let url = req.url
        const templatePath = resolve('public/index.html')
        const entryJsPath = (() => {
          if (url === '/') {
            if (options.mpa) {
              return '/src/pages/index/main'
            } else {
              return '/src/main'
            }
          } else {
            if (options.mpa) {
              return url?.replace('./', '/').replace(/(.*)\/(.*).html/, '$1/main')
            } else {
              return '/src/pages/index/main'
            }
          }
        })()
        const content = await getHtmlTemplate(templatePath, entryJsPath)
        const compiled = template(content)
        const data = {
          htmlWebpackPlugin: {
            options: {
              title: 'page title',
            },
          },
          webpackConfig: {
            name: 'page title',
            output: {
              publicPath: config.base,
            },
          },
          BASE_URL: config.base,
        }
        const html = compiled({
          ...data,
        })
        res.end(html)
      })
    },
    /**
     * for build
     * like HtmlWebpackPlugin,
     */
    async closeBundle() {
      console.log('[WIP]: build')
    },
  }
}

export type { UserOptions as HtmlTemplateOptions }
