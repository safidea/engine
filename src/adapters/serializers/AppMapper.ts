import { AppDto } from '@entities/app/AppSchema'
import { App } from '@entities/app/App'
import { AutomationMapper } from '../automation/mappers/AutomationMapper'
import { TableMapper } from '../table/mappers/TableMapper'
import { PageMapper } from '../page/mappers/PageMapper'
import { ILoggerSpi } from '@entities/drivers/logger/LoggerDriver'
import { IUISpi } from '@entities/drivers/ui/IUISpi'
import { IStorageSpi } from '@entities/drivers/storage/StorageDriver'
import { IConverterSpi } from '@entities/drivers/converter/ConverterDriver'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'

export interface AppMapperSpis {
  ui?: IUISpi
  logger?: ILoggerSpi
  storage?: IStorageSpi
  converter?: IConverterSpi
  templating?: ITemplatingSpi
}

export class AppMapper {
  static toEntity(appDto: AppDto, spis: AppMapperSpis): App {
    const { ui, logger, storage, converter, templating } = spis
    const tables = TableMapper.toEntities(appDto.tables ?? [])
    const pages = PageMapper.toEntities(appDto.pages ?? [], tables ?? [], { ui })
    const automations = AutomationMapper.toEntities(appDto.automations ?? [], tables ?? [], {
      logger,
      storage,
      converter,
      templating,
    })
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
