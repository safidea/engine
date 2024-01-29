import type { IDatabaseRow } from "@domain/drivers/IDatabase"

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

interface ISpecTableResult {
  table: string
  row: IDatabaseRow
}

export type ISpecTextResult =
  | ISpecHTMLTextResult
  | ISpecHTMLAttributeResult
  | ISpecAnchorTextResult
  | ISpecInputTextResult
  | ISpecTableResult

export type ISpecResult = ISpecTitleResult | ISpecTextResult
