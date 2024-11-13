import type { Integration } from '@adapter/spi/integrations/NotionSpi'
import { Client } from '@notionhq/client'
import { NotionTableIntegration } from './NotionTableIntegration'
import type { Config } from '@domain/integrations/Notion'

export class NotionIntegration implements Integration {
  private _notion?: Client

  constructor(private _config?: Config) {}

  config = () => {
    if (!this._notion) {
      if (!this._config) {
        throw new Error('Notion config not set')
      }
      const { token } = this._config
      this._notion = new Client({
        auth: token,
      })
    }
    return this._notion
  }

  table = async (id: string) => {
    const notion = this.config()
    const database = await notion.databases.retrieve({
      database_id: id,
    })
    if (!database || !('title' in database)) {
      throw new Error(`Database not found: ${id}`)
    }
    return new NotionTableIntegration(notion, database)
  }
}
