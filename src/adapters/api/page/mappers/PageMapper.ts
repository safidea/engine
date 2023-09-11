import { Page } from '@entities/app/page/Page'
import { ComponentMapper } from './ComponentMapper'
import { IUISpi } from '@entities/spi/IUISpi'
import { Table } from '@entities/app/table/Table'
import { PageDto } from '../dtos/PageDto'

export interface PageMapperSpis {
  ui?: IUISpi
}

export class PageMapper {
  static toEntity(pageDto: PageDto, tables: Table[], spis: PageMapperSpis): Page {
    const components = ComponentMapper.toEntities(pageDto.components, tables, spis)
    return new Page(pageDto.path, components, pageDto.title)
  }

  static toDto(page: Page): PageDto {
    const components = ComponentMapper.toDtos(page.components)
    return {
      path: page.path,
      title: page.title,
      components,
    }
  }

  static toEntities(pageDtos: PageDto[], tables: Table[], spis: PageMapperSpis): Page[] {
    return pageDtos.map((pageDto) => this.toEntity(pageDto, tables, spis))
  }

  static toDtos(pages: Page[]): PageDto[] {
    return pages.map((page) => this.toDto(page))
  }
}
