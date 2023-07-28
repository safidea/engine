import { ListDto } from '@application/dtos/page/components/ListDto'
import { List } from '@domain/entities/page/components/List'
import { Table } from '@domain/entities/table/Table'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToList(listDto: ListDto, ui: IUIGateway, tables: Table[]): List {
  return new List(
    listDto.table,
    listDto.groupBy,
    listDto.sortBy,
    listDto.columns,
    ui.ListUI,
    tables
  )
}

export function mapListToDto(list: List): ListDto {
  return {
    type: 'list',
    table: list.table,
    groupBy: list.groupBy,
    sortBy: list.sortBy,
    columns: list.columns,
  }
}
