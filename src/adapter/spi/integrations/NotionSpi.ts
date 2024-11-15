import {
  NotionTableSpi,
  type INotionTableIntegration,
} from '@adapter/spi/integrations/NotionTableSpi'
import type { INotionSpi } from '@domain/integrations/Notion'

export interface INotionIntegration {
  config: () => void
  table: (id: string) => Promise<INotionTableIntegration>
}

export class NotionSpi implements INotionSpi {
  constructor(private _integration: INotionIntegration) {}

  config = () => {
    this._integration.config()
  }

  table = async (id: string) => {
    const page = await this._integration.table(id)
    return new NotionTableSpi(page)
  }
}
