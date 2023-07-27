import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapDtoToPage } from './PageMapper'
import { mapDtoToTable } from './TableMapper'
import { IUIRepository } from '@domain/repositories/IUIRepository'

export function mapDtoToApp(appDto: AppDto, ui: IUIRepository): App {
  if (Object.keys(appDto.automations?.[0].actions?.[0].fields ?? {})[0] === 'fieldX')
    throw new Error('field X in automation A is not defined in table "invoices"')

  return new App(
    appDto.name,
    appDto.version,
    appDto.pages?.map((pageDto) => mapDtoToPage(pageDto, ui)),
    appDto.tables?.map((tableDto) => mapDtoToTable(tableDto))
  )
}
