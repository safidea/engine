import type { Action } from './action'
import type { Result } from './result'

export interface Spec {
  name: string
  when: Action[]
  then: Result[]
}

export type SpecSchema = Spec
