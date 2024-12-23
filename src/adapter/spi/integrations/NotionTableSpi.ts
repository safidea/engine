import { type Filter } from '@domain/entities/Filter'
import type { INotionTableSpi } from '@domain/integrations/Notion/NotionTable'
import type { FilterDto } from '../dtos/FilterDto'
import { FilterMapper } from '../mappers/FilterMapper'
import type { NotionTablePageProperties } from '@domain/integrations/Notion/NotionTablePage'
import { NotionTablePageMapper } from '../mappers/NotionTablePageMapper'
import type { NotionTablePageDto } from '../dtos/NotionTablePageDto'

export interface INotionTableIntegration {
  id: string
  name: string
  create: (page: NotionTablePageProperties) => Promise<NotionTablePageDto>
  update: (id: string, page: NotionTablePageProperties) => Promise<NotionTablePageDto>
  retrieve: (id: string) => Promise<NotionTablePageDto>
  archive: (id: string) => Promise<void>
  list: (filter?: FilterDto) => Promise<NotionTablePageDto[]>
}

export class NotionTableSpi implements INotionTableSpi {
  constructor(private _integration: INotionTableIntegration) {}

  get id() {
    return this._integration.id
  }

  get name() {
    return this._integration.name
  }

  create = async (page: NotionTablePageProperties) => {
    const dto = await this._integration.create(page)
    return NotionTablePageMapper.toEntity(dto)
  }

  update = async (id: string, page: NotionTablePageProperties) => {
    const dto = await this._integration.update(id, page)
    return NotionTablePageMapper.toEntity(dto)
  }

  retrieve = async (id: string) => {
    const dto = await this._integration.retrieve(id)
    return NotionTablePageMapper.toEntity(dto)
  }

  archive = async (id: string) => {
    return this._integration.archive(id)
  }

  list = async (filter?: Filter) => {
    const dtos = await this._integration.list(filter ? FilterMapper.toDto(filter) : undefined)
    return NotionTablePageMapper.toManyEntities(dtos)
  }
}
