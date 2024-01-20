import type { ISpecAction } from './ISpecAction'
import type { ISpecResult } from './ISpecResult'

export interface ISpec {
  name: string
  when: ISpecAction[]
  then: ISpecResult[]
}
