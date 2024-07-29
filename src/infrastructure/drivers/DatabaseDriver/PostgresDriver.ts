import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { PostgresTableDriver } from './PostgresTableDriver'

export class PostgresDriver implements Driver {
  private _db: pg.Pool
  private _client?: pg.PoolClient
  private _interval?: Timer

  constructor(config: Config) {
    const { url } = config
    const NUMERIC_OID = 1700
    const pool = new pg.Pool({ connectionString: url })
    pool.on('error', () => {})
    pool.on('connect', (client) => {
      client.on('error', () => {})
      client.setTypeParser(NUMERIC_OID, (value) => parseFloat(value))
    })
    this._db = pool
  }

  connect = async (): Promise<void> => {
    this._client = await this._db.connect()
  }

  disconnect = async (): Promise<void> => {
    if (this._interval) clearInterval(this._interval)
    if (this._client) this._client.release()
    await this._db.end()
  }

  exec = async (query: string): Promise<void> => {
    if (this._client && query.includes('LISTEN')) await this._client.query(query)
    else await this._db.query(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    const { rows, rowCount } = await this._db.query(text, values)
    return { rows, rowCount: rowCount || 0 }
  }

  table = (name: string) => {
    return new PostgresTableDriver(name, this._db)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (this._client) {
      if (event === 'notification')
        this._client.on('notification', ({ payload }) => {
          callback({ payload, event: 'notification' })
        })
      if (event === 'error')
        this._client.on('error', ({ message }) => {
          callback({ message, event: 'error' })
        })
    }
    this._db.on('error', ({ message }) => {
      callback({ message, event: 'error' })
    })
  }
}
