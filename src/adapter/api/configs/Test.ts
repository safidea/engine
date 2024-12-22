import type { IEvent } from './Event'
import type { IExpect } from './Expect'

export interface ITest {
  name: string
  when: IEvent[]
  then: IExpect[]
}
