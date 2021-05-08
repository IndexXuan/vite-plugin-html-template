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
       * @default 'Home Page'
       */
      title?: string
      /**
       * @default src/pages/${pageName}/main.{js,ts}
       * TODO: implemention
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
   * @default {}
   */
  data: Record<string, any>
}

export type UserOptions = Partial<Options>
