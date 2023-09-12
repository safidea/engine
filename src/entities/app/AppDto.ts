import { JSONSchemaType } from 'ajv'
import { AutomationDto, AutomationDtoSchema } from './automation/AutomationSchema'
import { PageDto, PageDtoSchema } from './page/PageDto'
import { TableDto, TableDtoSchema } from '../../adapters/api/table/dtos/TableDto'

export interface AppDto {
  name?: string
  version?: string
  pages?: PageDto[]
  tables?: TableDto[]
  automations?: AutomationDto[]
}

export const AppDtoSchema: JSONSchemaType<AppDto> = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: true },
    version: { type: 'string', nullable: true },
    pages: {
      type: 'array',
      items: PageDtoSchema,
      nullable: true,
    },
    tables: {
      type: 'array',
      items: TableDtoSchema,
      nullable: true,
    },
    automations: {
      type: 'array',
      items: AutomationDtoSchema,
      nullable: true,
    },
  },
  additionalProperties: false,
}
