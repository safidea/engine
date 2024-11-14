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
    const database = await NotionIntegration.retryIf502Error(async () => {
      return notion.databases.retrieve({
        database_id: id,
      })
    })
    if (!database || !('title' in database)) {
      throw new Error(`Database not found: ${id}`)
    }
    return new NotionTableIntegration(notion, database)
  }

  static retryIf502Error = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000
  ): Promise<T> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (error && typeof error === 'object' && 'status' in error && error.status === 502) {
          if (attempt < retries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs))
          } else {
            throw new Error('Failed after multiple 502 errors')
          }
        } else {
          throw error
        }
      }
    }
    throw new Error('Failed after multiple 502 errors')
  }
}
