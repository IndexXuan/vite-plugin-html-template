/**
 * HtmlTemplate Plugin options.
 */

export interface Options {
  /**
   * @see {@link https://cli.vuejs.org/config/#pages}
   */
  pages: {
    [pageName: string]: {
      /**
       * @default public/index.html
       */
      template?: string
      /**
       * @default 'page-title'
       */
      title?: string
      /**
       * @default src/pages/xxx/main.js
       * not implement
       */
      entry: string
      /**
       * @default 'index.html'
       * not implement
       */
      filename?: string
    }
  }
  data: Record<string, any>
}

export type UserOptions = Partial<Options>
