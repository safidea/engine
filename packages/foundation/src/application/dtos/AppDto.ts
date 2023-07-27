import { PageDto } from './PageDto'
import { TableDto } from './TableDto'

export interface AppDto {
  name?: string
  version?: string
  pages?: PageDto[]
  tables?: TableDto[]
  automations?: {
    actions: {
      fields: Record<string, string>
    }[]
  }[]
}
