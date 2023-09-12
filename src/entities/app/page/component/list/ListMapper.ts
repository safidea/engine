import { ListDto } from '@adapters/api/page/dtos/components/ListDto'
import { List } from '@entities/app/page/component/List'
import { Table } from '@entities/app/table/Table'
import { IUISpi } from '@entities/app/page/IUISpi'

export class ListMapper {
  static toEntity(listDto: ListDto, ui: IUISpi, tables: Table[]): List {
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

  static toEntities(listDtos: ListDto[], ui: IUISpi, tables: Table[]): List[] {
    return listDtos.map((listDto) => this.toEntity(listDto, ui, tables))
  }

  static toDtos(lists: List[]): ListDto[] {
    return lists.map((list) => this.toDto(list))
  }
}
