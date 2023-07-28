import { PageDto } from '@application/dtos/page/PageDto'
import { Page } from '@domain/entities/page/Page'
import { mapComponentToDto, mapDtoToComponent } from '../page/ComponentMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { Table } from '@domain/entities/table/Table'

export function mapDtoToPage(pageDto: PageDto, ui: IUIGateway, tables: Table[]): Page {
  return new Page(
    pageDto.path,
    pageDto.title,
    pageDto.components?.map((componentDto) => mapDtoToComponent(componentDto, ui, tables))
  )
}

export function mapPageToDto(page: Page): PageDto {
  return {
    path: page.path,
    title: page.title,
    components: page.components?.map((component) => mapComponentToDto(component)),
  }
}
