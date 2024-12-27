import {
  NotionTablePage,
  type NotionTablePageProperties,
} from '@domain/integrations/Notion/NotionTablePage'
import type { NotionTablePageDto } from '../dtos/NotionTablePageDto'

export class NotionTablePageMapper {
  static toEntity<T extends NotionTablePageProperties>(
    tablePageDto: NotionTablePageDto<T>
  ): NotionTablePage<T> {
    return new NotionTablePage(
      tablePageDto.id,
      tablePageDto.properties,
      new Date(tablePageDto.created_time),
      new Date(tablePageDto.last_edited_time),
      tablePageDto.archived
    )
  }

  static toManyEntities<T extends NotionTablePageProperties>(
    tablePageDtos: NotionTablePageDto<T>[]
  ): NotionTablePage<T>[] {
    return tablePageDtos.map(NotionTablePageMapper.toEntity<T>)
  }
}
