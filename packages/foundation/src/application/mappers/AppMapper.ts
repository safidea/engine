import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapDtoToPage } from './PageMapper'
import { mapDtoToTable } from './TableMapper'
import { IUIRepository } from '@domain/repositories/IUIRepository'
import { mapDtoToAutomation } from './AutomationMapper'

export function mapDtoToApp(appDto: AppDto, ui: IUIRepository): App {
  const tables = appDto.tables?.map((tableDto) => mapDtoToTable(tableDto))
  return new App(
    appDto.name,
    appDto.version,
    appDto.pages?.map((pageDto) => mapDtoToPage(pageDto, ui)),
    tables,
    appDto.automations?.map((automationDto) => mapDtoToAutomation(automationDto, tables))
  )
}
