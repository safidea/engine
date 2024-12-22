import type { IComponent } from './Component'
import type { IHead } from './Head'

export interface IPage {
  name: string
  path: string
  head?: IHead
  body: IComponent[]
}
