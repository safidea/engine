import type { NotionTablePageProperties } from '@domain/integrations/Notion/NotionTablePage'

export interface NotionTablePageDto<T extends NotionTablePageProperties> {
  id: string
  properties: T
  created_time: string
  last_edited_time: string
  archived: boolean
}
