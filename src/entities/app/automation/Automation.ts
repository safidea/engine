import { Trigger, newTrigger } from './trigger/Trigger'
import { TableList } from '../table/TableList'
import { AppConfig } from '../App'
import { Action, newAction } from './action/Action'
import { AutomationParams } from './AutomationParams'
import { RecordFieldValue } from '@entities/services/database/record/RecordData'
import { TriggerEvent } from './trigger/TriggerEvent'
import { BucketList } from '../bucket/BucketList'
import { AutomationServices } from './AutomationServices'

// TODO: mettre à jour ESLINT pour rajouter une règle disant que nous n'avons pas le droit autre chose que le domaine

export interface AutomationContext {
  [key: string]: RecordFieldValue | AutomationContext | AutomationContext[]
}

export interface AutomationConfig {
  tables: TableList
  buckets: BucketList
  automationName: string
}

export class Automation {
  name: string
  private trigger: Trigger
  private actions: Action[]

  constructor(params: AutomationParams, services: AutomationServices, config: AppConfig) {
    const { name, trigger: triggerParams, actions: actionsParams } = params
    this.name = name
    const automationConfig = { ...config, automationName: name }
    this.trigger = newTrigger(triggerParams, services, automationConfig)
    this.actions = actionsParams.map((actionParams) =>
      newAction(actionParams, services, automationConfig)
    )
  }

  async shouldTrigger(triggerEvent: TriggerEvent): Promise<boolean> {
    return this.trigger.shouldTrigger(triggerEvent)
  }

  async executeActions(context: AutomationContext) {
    for (const action of this.actions) {
      const result = await action.execute(context)
      context = { ...context, ...result }
    }
  }
}
