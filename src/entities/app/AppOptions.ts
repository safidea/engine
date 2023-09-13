import { AutomationOptions } from './automation/AutomationOptions'
import { PageOptions } from './page/PageOptions'
import { TableOptions } from './table/TableOptions'

export interface AppOptions {
  name?: string
  version?: string
  pages?: PageOptions[]
  tables?: TableOptions[]
  automations?: AutomationOptions[]
}
