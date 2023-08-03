import { PageDto } from '@application/dtos/page/PageDto'
import { Page } from '@domain/entities/page/Page'
import { mapComponentToDto, mapDtoToComponent } from './ComponentMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { Table } from '@domain/entities/table/Table'

export function mapDtoToPage(pageDto: PageDto, ui: IUIGateway, tables: Table[]): Page {
  return new Page(
    pageDto.path,
    pageDto.components.map((componentDto) => mapDtoToComponent(componentDto, ui, tables)),
    pageDto.title
  )
}

export function mapPageToDto(page: Page): PageDto {
  return {
    path: page.path,
    title: page.title,
    components: page.components.map((component) => mapComponentToDto(component)),
  }
}
