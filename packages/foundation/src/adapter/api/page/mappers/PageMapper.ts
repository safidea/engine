import { Page } from '@domain/entities/page/Page'
import { ComponentMapper } from './ComponentMapper'
import { UI } from '@adapter/spi/ui/UI'
import { Table } from '@domain/entities/table/Table'
import { PageDto } from '../dtos/PageDto'

export class PageMapper {
  static toEntity(pageDto: PageDto, ui: UI, tables: Table[]): Page {
    return new Page(
      pageDto.path,
      ComponentMapper.toEntities(pageDto.components, ui, tables),
      pageDto.title
    )
  }

  static toDto(page: Page): PageDto {
    return {
      path: page.path,
      title: page.title,
      components: ComponentMapper.toDtos(page.components),
    }
  }

  static toEntities(pageDtos: PageDto[], ui: UI, tables: Table[]): Page[] {
    return pageDtos.map((pageDto) => this.toEntity(pageDto, ui, tables))
  }

  static toDtos(pages: Page[]): PageDto[] {
    return pages.map((page) => this.toDto(page))
  }
}
