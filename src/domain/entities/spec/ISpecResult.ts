export interface ISpecTitleResult {
  title: string
}

export interface ISpecTextResult {
  text: string
  tag?: string
}

export type ISpecResult = ISpecTitleResult | ISpecTextResult
