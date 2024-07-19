import type { Test } from './Test'
import type { Page } from './Page'
import type { Table } from './Table'
import type { Automation } from './Automation'
import type { Services } from './Services'

export interface App extends Services {
  name: string
  tests?: Test[]
  pages?: Page[]
  tables?: Table[]
  automations?: Automation[]
}

export type AppSchema = App
