import {
  NotionTableSpi,
  type Integration as NotionTableIntegration,
} from '@adapter/spi/integrations/NotionTableSpi'
import type { Spi } from '@domain/integrations/Notion'

export interface Integration {
  config: () => void
  table: (id: string) => Promise<NotionTableIntegration>
}

export class NotionSpi implements Spi {
  constructor(private _integration: Integration) {}

  config = () => {
    this._integration.config()
  }

  table = async (id: string) => {
    const page = await this._integration.table(id)
    return new NotionTableSpi(page)
  }
}
