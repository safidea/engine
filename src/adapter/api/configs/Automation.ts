import type { IAction } from './Action'
import type { ITrigger } from './Trigger'

export interface IAutomation {
  name: string
  trigger: ITrigger
  actions: IAction[]
}
