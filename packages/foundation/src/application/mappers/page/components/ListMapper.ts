import { ListDto } from '@application/dtos/page/components/ListDto'
import { List } from '@domain/entities/page/components/List'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToList(listDto: ListDto, ui: IUIGateway): List {
  return new List(listDto.table, listDto.groupBy, listDto.sortBy, listDto.columns, ui.ListUI)
}
