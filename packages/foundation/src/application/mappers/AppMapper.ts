import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapDtoToPage } from './table/PageMapper'
import { mapDtoToTable } from './table/TableMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapDtoToAutomation } from './automation/AutomationMapper'

export function mapDtoToApp(appDto: AppDto, ui: IUIGateway): App {
  const tables = appDto.tables?.map((tableDto) => mapDtoToTable(tableDto))
  const pages = appDto.pages?.map((pageDto) => mapDtoToPage(pageDto, ui, tables ?? []))
  const automations = appDto.automations?.map((automationDto) =>
    mapDtoToAutomation(automationDto, tables)
  )
  return new App(appDto.name, appDto.version, pages, tables, automations)
}
