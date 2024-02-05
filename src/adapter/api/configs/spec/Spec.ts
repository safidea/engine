import type { Action } from './Action'
import type { Result } from './Result'

export interface Spec {
  name: string
  when: Action[]
  then: Result[]
}
