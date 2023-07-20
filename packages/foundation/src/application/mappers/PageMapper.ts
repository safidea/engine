import { PageDto } from '@application/dtos/PageDto'
import { Page } from '@domain/entities/Page'
import { mapDtoToComponents } from './ComponentMapper'

export function mapDtoToPage(pageDto: PageDto): Page {
  return new Page(
    pageDto.path,
    pageDto.title,
    pageDto.components?.map((componentDto) => mapDtoToComponents(componentDto))
  )
}
