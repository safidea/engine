import { type Filter } from '@domain/entities/Filter'
import type {
  NotionTablePage,
  NotionTablePageProperties,
  Spi,
} from '@domain/integrations/NotionTable'
import type { FilterDto } from '../dtos/FilterDto'
import { FilterMapper } from '../mappers/FilterMapper'

export interface Integration {
  name: string
  create: (page: NotionTablePageProperties) => Promise<string>
  retrieve: (id: string) => Promise<NotionTablePage>
  archive: (id: string) => Promise<void>
  list: (filter?: FilterDto) => Promise<NotionTablePage[]>
}

export class NotionTableSpi implements Spi {
  constructor(private _integration: Integration) {}

  get name() {
    return this._integration.name
  }

  create = async (page: NotionTablePageProperties) => {
    return this._integration.create(page)
  }

  retrieve = async (id: string) => {
    return this._integration.retrieve(id)
  }

  archive = async (id: string) => {
    return this._integration.archive(id)
  }

  list = async (filter?: Filter) => {
    return this._integration.list(filter ? FilterMapper.toDto(filter) : undefined)
  }
}
