import {
  NotionTableSpi,
  type INotionTableIntegration,
} from '@adapter/spi/integrations/NotionTableSpi'
import type { INotionSpi, NotionConfig } from '@domain/integrations/Notion'
import { NotionUserMapper } from '../mappers/NotionUserMapper'
import type { NotionUserDto } from '../dtos/NotionUserDto'

export interface INotionIntegration {
  getConfig: () => NotionConfig
  getTable: (id: string) => Promise<INotionTableIntegration>
  listAllUsers: () => Promise<NotionUserDto[]>
}

export class NotionSpi implements INotionSpi {
  constructor(private _integration: INotionIntegration) {}

  getConfig = () => {
    return this._integration.getConfig()
  }

  getTable = async (id: string) => {
    const page = await this._integration.getTable(id)
    return new NotionTableSpi(page)
  }

  listAllUsers = async () => {
    const dto = await this._integration.listAllUsers()
    return NotionUserMapper.toManyEntities(dto)
  }
}
