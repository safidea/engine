import {
  NotionTableSpi,
  type INotionTableIntegration,
} from '@adapter/spi/integrations/NotionTableSpi'
import type { INotionSpi, NotionConfig } from '@domain/integrations/Notion'

export interface INotionIntegration {
  config: () => NotionConfig
  table: (id: string) => Promise<INotionTableIntegration>
}

export class NotionSpi implements INotionSpi {
  constructor(private _integration: INotionIntegration) {}

  config = () => {
    return this._integration.config()
  }

  table = async (id: string) => {
    const page = await this._integration.table(id)
    return new NotionTableSpi(page)
  }
}
