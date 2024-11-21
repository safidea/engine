import type { INotionIntegration } from '@adapter/spi/integrations/NotionSpi'
import { APIErrorCode, Client, isNotionClientError } from '@notionhq/client'
import { NotionTableIntegration } from './NotionTableIntegration'
import type { NotionConfig } from '@domain/integrations/Notion'

export class NotionIntegration implements INotionIntegration {
  private _notion?: Client

  constructor(private _config?: NotionConfig) {}

  config = () => {
    if (!this._config) {
      throw new Error('Notion config not set')
    }
    return this._config
  }

  table = async (id: string) => {
    const api = this._api()
    const database = await NotionIntegration.retry(
      async () =>
        await api.databases.retrieve({
          database_id: id,
        })
    )
    if (!database || !('title' in database)) {
      throw new Error(`Database not found: ${id}`)
    }
    return new NotionTableIntegration(api, database)
  }

  private _api = (): Client => {
    if (!this._notion) {
      const { token } = this.config()
      this._notion = new Client({
        auth: token,
      })
    }
    return this._notion
  }

  static retry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (isNotionClientError(error)) {
          const headers = 'headers' in error ? (error.headers as Headers) : undefined
          switch (error.code) {
            case APIErrorCode.RateLimited:
              await new Promise((resolve) => {
                setTimeout(resolve, Number(headers?.get('retry-after') ?? 0) * 1000)
              })
              break
            default:
              throw error
          }
        } else if (error && typeof error === 'object' && 'status' in error) {
          if (error.status === 502) {
            if (attempt < retries - 1) {
              await new Promise((resolve) => setTimeout(resolve, 10000))
            } else {
              throw new Error(`Failed after multiple 502 errors`)
            }
          } else {
            throw error
          }
        } else {
          throw error
        }
      }
    }
    throw new Error('Failed after multiple retries')
  }
}
