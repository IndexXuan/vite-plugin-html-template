/**
 * HtmlTemplate Plugin options.
 */

export interface Options {
  /**
   * 是否是 MPA multi-page application
   */
  mpa: boolean
}

export type UserOptions = Partial<Options>
