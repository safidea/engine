import type { INotionIntegration } from '@adapter/spi/integrations/NotionSpi'
import { APIErrorCode, Client, isNotionClientError } from '@notionhq/client'
import { NotionTableIntegration } from './NotionTableIntegration'
import type { NotionConfig } from '@domain/integrations/Notion'
import type {
  DatabaseObjectResponse,
  PartialDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { NotionUserDto } from '@adapter/spi/dtos/NotionUserDto'

export class NotionIntegration implements INotionIntegration {
  private _notion?: Client

  constructor(private _config?: NotionConfig) {}

  getConfig = () => {
    if (!this._config) {
      throw new Error('Notion config not set')
    }
    return this._config
  }

  getTable = async (id: string) => {
    const api = this._api()
    const database = await this._retry(() =>
      api.databases.retrieve({
        database_id: id,
      })
    )
    return new NotionTableIntegration(
      api,
      this._throwIfNotDatabaseObjectResponse(database),
      this._retry
    )
  }

  listAllUsers = async (): Promise<NotionUserDto[]> => {
    const api = this._api()
    const users = await this._retry(() => api.users.list({}))
    return users.results
      .filter((user) => user.type === 'person')
      .map((user) => {
        if (!user.person?.email) {
          throw new Error('Notion user is missing person email')
        }
        return {
          id: user.id,
          email: user.person.email,
          name: user.name,
          avatarUrl: user.avatar_url,
        }
      })
  }

  private _api = (): Client => {
    if (!this._notion) {
      const { token } = this.getConfig()
      this._notion = new Client({
        auth: token,
      })
    }
    return this._notion
  }

  private _throwIfNotDatabaseObjectResponse(
    database: DatabaseObjectResponse | PartialDatabaseObjectResponse
  ): DatabaseObjectResponse {
    if (database.object === 'database' && 'title' in database) {
      return database
    }
    throw new Error('Not a PageObjectResponse')
  }

  private _retry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
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
            case APIErrorCode.ConflictError:
              if (attempt < retries - 1) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
              } else {
                throw new Error('Failed after multiple conflict errors')
              }
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
