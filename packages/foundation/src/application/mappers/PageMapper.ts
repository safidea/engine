import { PageDto } from '@application/dtos/PageDto'
import { Page } from '@domain/entities/Page'
import { mapDtoToComponent } from './ComponentMapper'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export function mapDtoToPage(pageDto: PageDto, ui: IUIRepository): Page {
  return new Page(
    pageDto.path,
    pageDto.title,
    pageDto.components?.map((componentDto) => mapDtoToComponent(componentDto, ui))
  )
}
