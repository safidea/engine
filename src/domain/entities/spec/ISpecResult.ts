export interface ISpecTitleResult {
  title: string
}

interface ISpecHTMLTextResult {
  text: string
  tag?: keyof HTMLElementTagNameMap
  attribute?: undefined
  value?: undefined
}

interface ISpecHTMLAttributeResult {
  text: string
  tag?: keyof HTMLElementTagNameMap
  attribute: keyof HTMLElement
  value: string
}

interface ISpecAnchorTextResult {
  text: string
  tag: 'a'
  attribute: keyof HTMLAnchorElement
  value: string
}

interface ISpecInputTextResult {
  input: string
  value: string
}

export type ISpecTextResult = ISpecHTMLTextResult | ISpecHTMLAttributeResult | ISpecAnchorTextResult | ISpecInputTextResult

export type ISpecResult = ISpecTitleResult | ISpecTextResult
