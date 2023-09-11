import Ajv from 'ajv'
import { AppMapper } from '@adapters/api/app/AppMapper'
import { App } from '@entities/app/App'
import { AppDtoSchema } from './AppDto'
import { ILoggerSpi } from '@entities/spi/ILoggerSpi'
import { IUISpi } from '@entities/spi/IUISpi'
import { IStorageSpi } from '@entities/spi/IStorageSpi'
import { IConverterSpi } from '@entities/spi/IConverterSpi'
import { ITemplatingSpi } from '@entities/spi/ITemplatingSpi'

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
