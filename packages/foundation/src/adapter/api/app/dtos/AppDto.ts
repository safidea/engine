import { AutomationDto, AutomationDtoSchema } from '../../automation/dtos/AutomationDto'
import { PageDto, PageDtoSchema } from '../../page/dtos/PageDto'
import { TableDto, TableDtoSchema } from '../../table/dtos/TableDto'
import { JSONSchemaType } from '../../utils/AjvUtils'

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
