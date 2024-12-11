import {
  NotionTableSpi,
  type INotionTableIntegration,
} from '@adapter/spi/integrations/NotionTableSpi'
import type { INotionSpi, NotionConfig } from '@domain/integrations/Notion'

export interface INotionIntegration {
  getConfig: () => NotionConfig
  getTable: (id: string) => Promise<INotionTableIntegration>
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
}
