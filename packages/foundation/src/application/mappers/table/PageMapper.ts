import { PageDto } from '@application/dtos/page/PageDto'
import { Page } from '@domain/entities/page/Page'
import { mapComponentToDto, mapDtoToComponent } from '../page/ComponentMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'

export function mapDtoToPage(pageDto: PageDto, ui: IUIGateway): Page {
  return new Page(
    pageDto.path,
    pageDto.title,
    pageDto.components?.map((componentDto) => mapDtoToComponent(componentDto, ui))
  )
}

export function mapPageToDto(page: Page): PageDto {
  return {
    path: page.path,
    title: page.title,
    components: page.components?.map((component) => mapComponentToDto(component)),
  }
}
