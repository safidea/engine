import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { App } from '@domain/entities/app/App'
import { AutomationMapper } from '../../automation/mappers/AutomationMapper'
import { TableMapper } from '../../table/mappers/TableMapper'
import { PageMapper } from '../../page/mappers/PageMapper'
import { ILogSpi } from '@domain/spi/ILogSpi'
import { IUISpi } from '@domain/spi/IUISpi'

export interface AppMapperSpis {
  ui: IUISpi
  log: ILogSpi
}

export class AppMapper {
  static toEntity(appDto: AppDto, spis: AppMapperSpis): App {
    const { ui, log } = spis
    const tables = TableMapper.toEntities(appDto.tables ?? [])
    const pages = PageMapper.toEntities(appDto.pages ?? [], tables ?? [], { ui })
    const automations = AutomationMapper.toEntities(appDto.automations ?? [], tables ?? [], { log })
    return new App(appDto.name, appDto.version, pages, tables, automations)
  }

  static toDto(app: App): AppDto {
    const tables = TableMapper.toDtos(app.tables)
    const pages = PageMapper.toDtos(app.pages)
    const automations = AutomationMapper.toDtos(app.automations)
    return {
      name: app.name,
      version: app.version,
      pages,
      tables,
      automations,
    }
  }
}
