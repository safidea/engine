import Ajv from 'ajv'
import { AppMapper } from '@adapters/api/app/AppMapper'
import { App } from '@entities/app/App'
import { AppDtoSchema } from '../../entities/app/AppSchema'
import { ILoggerSpi } from '@entities/drivers/logger/LoggerDriver'
import { IUISpi } from '@entities/drivers/ui/IUISpi'
import { IStorageSpi } from '@entities/drivers/storage/StorageDriver'
import { IConverterSpi } from '@entities/drivers/converter/ConverterDriver'
import { ITemplatingSpi } from '@entities/drivers/templater/ITemplatingSpi'

const ajv = new Ajv({ allowUnionTypes: true })
const validateAppDto = ajv.compile(AppDtoSchema)

export interface AppMiddlewareSpis {
  ui: IUISpi
  logger: ILoggerSpi
  storage: IStorageSpi
  converter: IConverterSpi
  templating: ITemplatingSpi
}

export class AppMiddleware {
  constructor(
    private config: unknown,
    private spis: AppMiddlewareSpis
  ) {}

  validateConfig(): App {
    if (validateAppDto(this.config)) {
      return AppMapper.toEntity(this.config, this.spis)
    }
    if (validateAppDto.errors) throw new Error(JSON.stringify(validateAppDto.errors, null, 2))
    throw new Error('should throw a validation error')
  }
}
