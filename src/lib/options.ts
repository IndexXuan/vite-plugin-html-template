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
       * @default src/pages/xxx/main.js
       */
      entry: string
      /**
       * @default public/index.html
       */
      template?: string
      /**
       * @default 'page-title'
       */
      title?: string
      /**
       * @default 'index.html'
       */
      filename?: string
    }
  }
}

export type UserOptions = Partial<Options>
