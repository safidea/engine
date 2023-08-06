import { ListDto } from '@adapter/api/page/dtos/components/ListDto'
import { List } from '@domain/entities/page/components/List'
import { Table } from '@domain/entities/table/Table'
import { UI } from '@adapter/spi/ui/UI'

export class ListMapper {
  static toEntity(listDto: ListDto, ui: UI, tables: Table[]): List {
    return new List(
      listDto.table,
      listDto.groupBy,
      listDto.sortBy,
      listDto.columns,
      ui.ListUI,
      tables
    )
  }

  static toDto(list: List): ListDto {
    return {
      type: 'list',
      table: list.table,
      groupBy: list.groupBy,
      sortBy: list.sortBy,
      columns: list.columns,
    }
  }

  static toEntities(listDtos: ListDto[], ui: UI, tables: Table[]): List[] {
    return listDtos.map((listDto) => this.toEntity(listDto, ui, tables))
  }

  static toDtos(lists: List[]): ListDto[] {
    return lists.map((list) => this.toDto(list))
  }
}
