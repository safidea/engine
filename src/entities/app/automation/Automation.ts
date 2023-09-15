import { Trigger, newTrigger } from './trigger/Trigger'
import { TableList } from '../table/TableList'
import { AppConfig, AppDrivers } from '../App'
import { Action, newAction } from './action/Action'
import { AutomationParams } from './AutomationParams'
import { RecordFieldValue } from '@entities/drivers/database/record/RecordData'

// TODO: mettre à jour ESLINT pour rajouter une règle disant que nous n'avons pas le droit autre chose que le domaine

export interface AutomationContext {
  [key: string]: RecordFieldValue | AutomationContext | AutomationContext[]
}

export interface AutomationConfig {
  tables: TableList
  automationName: string
}

export class Automation {
  name: string
  private trigger: Trigger
  private actions: Action[]

  constructor(params: AutomationParams, drivers: AppDrivers, config: AppConfig) {
    const { name, trigger: triggerParams, actions: actionsParams } = params
    this.name = name
    const automationConfig = { ...config, automationName: name }
    this.trigger = newTrigger(triggerParams, drivers, automationConfig)
    this.actions = actionsParams.map((actionParams) =>
      newAction(actionParams, drivers, automationConfig)
    )
  }

  async shouldTrigger(event: string, context: AutomationContext): Promise<boolean> {
    return this.trigger.shouldTrigger(event, context)
  }

  async executeActions(context: AutomationContext) {
    for (const action of this.actions) {
      const result = await action.execute(context)
      context = { ...context, ...result }
    }
  }
}
