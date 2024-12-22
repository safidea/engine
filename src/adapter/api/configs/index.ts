import type { ITest } from './Test'
import type { IPage } from './Page'
import type { ITable } from './Table'
import type { IAutomation } from './Automation'
import type { IServices } from './Services'
import type { IBucket } from './Bucket'
import type { IIntegrations } from './Integrations'

export interface Config extends IServices {
  name: string
  tests?: ITest[]
  pages?: IPage[]
  tables?: ITable[]
  buckets?: IBucket[]
  automations?: IAutomation[]
  integrations?: IIntegrations
}

export type AppSchema = Config
