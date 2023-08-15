import Ajv from 'ajv'
import { AppMapper } from '@adapter/api/app/AppMapper'
import { App } from '@domain/entities/app/App'
import { AppDtoSchema } from './AppDto'
import { ILogSpi } from '@domain/spi/ILogSpi'
import { IUISpi } from '@domain/spi/IUISpi'
import { IStorageSpi } from '@domain/spi/IStorageSpi'

const ajv = new Ajv({ allowUnionTypes: true })
const validateAppDto = ajv.compile(AppDtoSchema)

export interface AppMiddlewareSpis {
  ui: IUISpi
  log: ILogSpi
  storage: IStorageSpi
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
    if (validateAppDto.errors) throw new Error(JSON.stringify(validateAppDto.errors[0], null, 2))
    throw new Error('should throw a validation error')
  }
}
