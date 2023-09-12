import { Trigger, newTrigger } from './Trigger'
import { RecordData } from '@entities/drivers/database/Record/IRecord'
import { Tables } from '../Tables'
import { AppDrivers } from '../App'
import { Action, newAction } from './Action'
import { AutomationOptions } from './AutomationOptions'

// TODO: mettre à jour ESLINT pour rajouter une règle disant que nous n'avons pas le droit autre chose que le domaine

export interface AutomationContext {
  [key: string]: string | number | boolean | undefined | string[] | RecordData[] | AutomationContext
}

export interface AutomationConfig {
  tables: Tables
}

export class Automation {
  name: string
  private trigger: Trigger
  private actions: Action[]

  constructor(options: AutomationOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { name, trigger: triggerOptions, actions: actionsOptions } = options
    this.name = name
    this.trigger = newTrigger(triggerOptions, drivers, config)
    this.actions = actionsOptions.map((actionOptions) => newAction(actionOptions, drivers, config))
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
