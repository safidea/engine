import * as t from 'io-ts'
import { ActionParams } from './action/ActionParams'
import { TriggerParams } from './trigger/TriggerParams'

export type AutomationParams = {
  readonly name: string
  readonly trigger: TriggerParams
  readonly actions: readonly ActionParams[]
}

export const AutomationParams: t.Type<AutomationParams> = t.type({
  name: t.string,
  trigger: TriggerParams,
  actions: t.array(ActionParams),
})
