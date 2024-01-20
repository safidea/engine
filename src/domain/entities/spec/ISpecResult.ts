export interface ISpecTitleResult {
  title: string
}

export interface ISpecTextResult {
  text: string
}

export type ISpecResult = ISpecTitleResult | ISpecTextResult
