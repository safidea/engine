import Ajv from 'ajv'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { App } from '@domain/entities/app/App'
import { AppDtoSchema } from './dtos/AppDto'
import { ILogSpi } from '@domain/spi/ILogSpi'
import { IUISpi } from '@domain/spi/IUISpi'

const ajv = new Ajv({ allowUnionTypes: true })
const validateAppDto = ajv.compile(AppDtoSchema)

export interface AppMiddlewareSpis {
  ui: IUISpi
  log: ILogSpi
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
