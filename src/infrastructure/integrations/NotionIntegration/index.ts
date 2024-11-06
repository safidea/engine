import type { Integration } from '@adapter/spi/integrations/NotionSpi'
import { Client } from '@notionhq/client'
import { NotionTableIntegration } from './NotionTableIntegration'
import type { Config } from '@domain/integrations/Notion'

export class NotionIntegration implements Integration {
  private _notion: Client

  constructor(config: Config) {
    const { token } = config
    this._notion = new Client({
      auth: token,
    })
  }

  table = async (id: string) => {
    const database = await this._notion.databases.retrieve({
      database_id: id,
    })
    return new NotionTableIntegration(this._notion, database)
  }
}
