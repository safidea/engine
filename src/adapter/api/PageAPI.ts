import { Services } from '@domain/services'
import { SPIs, type Drivers } from '@adapter/spi'
import { PageMapper } from './mappers/PageMapper'
import type { Page, PageConfig } from '@domain/entities/Page'
import { PageError } from '@domain/entities/PageError'

export class PageAPI {
  constructor(private drivers: Drivers) {}

  async create(
    config: unknown,
    params?: {
      drivers?: Partial<Drivers>
    }
  ): Promise<{
    page?: Page
    errors: PageError[]
  }> {
    const { drivers = {} } = params ?? {}
    const services = new Services(new SPIs({ ...this.drivers, ...drivers }))
    const schema = services.schemaValidator().validate<PageConfig>(config, 'page')
    if (schema.errors) return { errors: PageMapper.toErrorEntities(schema.errors) }
    if (!schema.json) return { errors: [new PageError('UNKNOWN_SCHEMA_ERROR')] }
    const page = PageMapper.toEntity(schema.json, services)
    const errors = page.validateConfig()
    if (errors.length > 0) return { errors }
    return { page, errors: [] }
  }
}
