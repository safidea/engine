import { NotionTablePage } from '@domain/integrations/NotionTablePage'
import type { NotionTablePageDto } from '../dtos/NotionTablePageDto'

export class NotionTablePageMapper {
  static toEntity(tablePageDto: NotionTablePageDto): NotionTablePage {
    return new NotionTablePage(
      tablePageDto.id,
      tablePageDto.properties,
      tablePageDto.created_time,
      tablePageDto.last_edited_time
    )
  }

  static toManyEntities(tablePageDtos: NotionTablePageDto[]): NotionTablePage[] {
    return tablePageDtos.map(NotionTablePageMapper.toEntity)
  }
}
