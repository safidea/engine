import { JSONSchemaType } from 'ajv'
import { AppOptions } from './AppOptions'
import { AutomationSchema } from './automation/AutomationSchema'
import { PageSchema } from './page/PageSchema'
import { TableSchema } from './table/TableSchema'

export const AppSchema: JSONSchemaType<AppOptions> = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    version: { type: 'string', nullable: true },
    pages: {
      type: 'array',
      items: PageSchema,
      nullable: true,
    },
    tables: {
      type: 'array',
      items: TableSchema,
      nullable: true,
    },
    automations: {
      type: 'array',
      items: AutomationSchema,
      nullable: true,
    },
  },
  additionalProperties: false,
}
