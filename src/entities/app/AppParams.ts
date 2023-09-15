import * as t from 'io-ts'
import { AutomationParams } from './automation/AutomationParams'
import { PageParams } from './page/PageParams'
import { TableParams } from './table/TableParams'

export const AppParams = t.partial({
  name: t.string,
  version: t.string,
  pages: t.array(PageParams),
  tables: t.array(TableParams),
  automations: t.array(AutomationParams),
  tmpFolder: t.string,
})

export type AppParams = t.TypeOf<typeof AppParams>
