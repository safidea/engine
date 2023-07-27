import { AutomationDto } from './AutomationDto'
import { PageDto } from './PageDto'
import { TableDto } from './TableDto'

export interface AppDto {
  name?: string
  version?: string
  pages?: PageDto[]
  tables?: TableDto[]
  automations?: AutomationDto[]
}
