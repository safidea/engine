export interface ISpecOpenAction {
  open: string
}

export interface ISpecFillAction {
  fill: string
  value: string
}

export interface ISpecClickAction {
  click: string
}

export interface ISpecPostAction {
  post: string
  body?: object
}

export type ISpecAction = ISpecOpenAction | ISpecFillAction | ISpecClickAction | ISpecPostAction
