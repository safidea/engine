import type { NotionTablePageProperties } from '@domain/integrations/NotionTablePage'

export interface NotionTablePageDto {
  id: string
  properties: NotionTablePageProperties
  created_time: string
}
