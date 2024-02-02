import { type Drivers } from '@adapter/spi'
import { PageMapper } from './mappers/PageMapper'
import type { Page } from '@domain/entities/Page'
import { PageError } from '@domain/entities/PageError'
import type { PageDto } from './dtos/PageDto'
import type { ReactComponents } from '@domain/entities/Component'
import { Api, type ApiParams } from './Api'

export class PageApi extends Api {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components)
  }

  async create(
    config: unknown,
    params?: ApiParams
  ): Promise<{
    page?: Page
    errors: PageError[]
  }> {
    const services = this.services(params)
    const schema = services.schemaValidator().validate<PageDto>(config, 'page')
    if (schema.errors) return { errors: PageMapper.toErrorEntities(schema.errors) }
    if (!schema.json) return { errors: [new PageError('UNKNOWN_SCHEMA_ERROR')] }
    const page = PageMapper.toEntity(schema.json, services)
    const errors = page.validateConfig()
    if (errors.length > 0) return { errors }
    return { page, errors: [] }
  }
}
