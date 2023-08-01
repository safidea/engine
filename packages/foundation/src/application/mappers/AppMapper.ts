import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapDtoToPage, mapPageToDto } from './table/PageMapper'
import { mapDtoToTable, mapTableToDto } from './table/TableMapper'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { mapAutomationToDto, mapDtoToAutomation } from './automation/AutomationMapper'

export function mapDtoToApp(appDto: AppDto, ui: IUIGateway): App {
  const tables = appDto.tables?.map((tableDto) => mapDtoToTable(tableDto))
  const pages = appDto.pages?.map((pageDto) => mapDtoToPage(pageDto, ui, tables ?? []))
  const automations = appDto.automations?.map((automationDto) =>
    mapDtoToAutomation(automationDto, tables)
  )
  return new App(appDto.name, appDto.version, pages, tables, automations)
}

export function mapAppToDto(app: App): AppDto {
  const tables = app.tables.map((table) => mapTableToDto(table))
  const pages = app.pages.map((page) => mapPageToDto(page))
  const automations = app.automations.map((automation) => mapAutomationToDto(automation))
  return {
    name: app.name,
    version: app.version,
    pages,
    tables,
    automations,
  }
}
