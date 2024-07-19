import type { Event } from './Event'
import type { Expect } from './Expect'

export interface Test {
  name: string
  when: Event[]
  then: Expect[]
}
