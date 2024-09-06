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
       * @default SPA => 'main'; MPA => 'src/pages/${pageName}/main'
       */
      entry?: string
      /**
       * @default '${pageName}/index.html' at dest
       * not implements and have no idea
       */
      filename?: string
    }
  }
  /**
   * data expose to template.
   * @default {}
   */
  data: Record<string, any>
  /**
   * @default '/src/main'
   */
  entry?: string
  /**
   * template path for all pages, has lower priority than `template` in `pages`
   * @default public/index.html
   */
  template?: string
}

export type UserOptions = Partial<Options>
