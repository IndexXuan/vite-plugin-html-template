/**
 * HtmlTemplate Plugin options.
 */

export interface Options {
  /**
   * is MPA multi-page application or not
   * @default false
   */
  mpa: boolean
}

export type UserOptions = Partial<Options>
