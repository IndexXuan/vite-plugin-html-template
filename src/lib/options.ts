/**
 * HtmlTemplate Plugin options.
 */

export interface Options {
  /**
   * page dir
   * @default 'src/pages'
   */
  pagesDir: string
  /**
   * pages options
   * @see {@link https://cli.vuejs.org/config/#pages}
   */
  pages: {
    [pageName: string]: {
      /**
       * @default public/index.html
       */
      template?: string
      /**
       * @default 'Home Page'
       */
      title?: string
      /**
       * @default main(src/pages/${pageName}/main)
       */
      entry?: string
      /**
       * @default 'index.html'
       * TODO: implemention
       */
      filename?: string
    }
  }
  /**
   * data expose to template.
   * @default {}
   */
  data: Record<string, any>
}

export type UserOptions = Partial<Options>
