import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapDtoToPage } from './PageMapper'
import { mapDtoToTable } from './TableMapper'

export function mapDtoToApp(appDto: AppDto): App {
  return new App(
    appDto.name,
    appDto.version,
    appDto.pages?.map((pageDto) => mapDtoToPage(pageDto)),
    appDto.tables?.map((tableDto) => mapDtoToTable(tableDto))
  )
}
