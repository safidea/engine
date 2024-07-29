import pg from 'pg'
import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { PostgresTableDriver } from './PostgresTableDriver'

export class PostgresDriver implements Driver {
  private db: pg.Pool
  private client?: pg.PoolClient
  private interval?: Timer

  constructor(config: Config) {
    const { url } = config
    const NUMERIC_OID = 1700
    const pool = new pg.Pool({ connectionString: url })
    pool.on('error', () => {})
    pool.on('connect', (client) => {
      client.on('error', () => {})
      client.setTypeParser(NUMERIC_OID, (value) => parseFloat(value))
    })
    this.db = pool
  }

  connect = async (): Promise<void> => {
    this.client = await this.db.connect()
  }

  disconnect = async (): Promise<void> => {
    if (this.interval) clearInterval(this.interval)
    if (this.client) this.client.release()
    await this.db.end()
  }

  exec = async (query: string): Promise<void> => {
    if (this.client && query.includes('LISTEN')) await this.client.query(query)
    else await this.db.query(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    const { rows, rowCount } = await this.db.query(text, values)
    return { rows, rowCount: rowCount || 0 }
  }

  table = (name: string) => {
    return new PostgresTableDriver(name, this.db)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    if (this.client) {
      if (event === 'notification')
        this.client.on('notification', ({ payload }) => {
          callback({ payload, event: 'notification' })
        })
      if (event === 'error')
        this.client.on('error', ({ message }) => {
          callback({ message, event: 'error' })
        })
    }
    this.db.on('error', ({ message }) => {
      callback({ message, event: 'error' })
    })
  }
}
