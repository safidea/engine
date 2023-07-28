import { AutomationDto } from './automation/AutomationDto'
import { PageDto } from './page/PageDto'
import { TableDto } from './table/TableDto'

export interface AppDto {
  name?: string
  version?: string
  pages?: PageDto[]
  tables?: TableDto[]
  automations?: AutomationDto[]
}
