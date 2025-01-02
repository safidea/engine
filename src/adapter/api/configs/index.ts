import type { ITable } from './Table'
import type { IAutomation } from './Automation'
import type { IServices } from './Services'
import type { IBucket } from './Bucket'
import type { IIntegrations } from './Integrations'

export interface Config extends IServices {
  name: string
  tables?: ITable[]
  buckets?: IBucket[]
  automations?: IAutomation[]
  integrations?: IIntegrations
}

export type AppSchema = Config
