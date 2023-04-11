import ActionService from '../services/action.service'
import { Automations } from '../../types'

import type { Action, Input } from '../../types'
import type { Data } from 'foundation-database'

class AutomationService {
  private automations: Automations = {}

  constructor() {
    this.automations = ConfigService.get('automations') as Automations
    this.buildInputs()
  }

  get(name: string): Action {
    return this.automations[name]
  }

  getNames(): string[] {
    return Object.keys(this.automations)
  }

  buildInputs(): void {
    const automation = this.automations[name]
    const actionsInputs = Object.keys(automation.actions).map(
      (res, action) => ActionService.get(action).input
    )
    const input = actionsInputs.reduce((res, input) => {
      return { ...res, ...input }
    }, {} as Input)
    return input
  }

  validateInput(name: string, input: Data): boolean {
    const inputSchema = this.getInput(name)
    return validate(input, inputSchema)
  }

  async start(name: string, input: Data, callback: (result: Data) => void) {
    return
  }

  async run() {
    return
  }

  async stop() {
    return
  }

  async end() {
    return
  }
}

const service = new AutomationService()

export default service
