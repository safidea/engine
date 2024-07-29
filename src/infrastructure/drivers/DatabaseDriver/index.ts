import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { SqliteDriver } from './SqliteDriver'
import { PostgresDriver } from './PostgresDriver'

export class DatabaseDriver implements Driver {
  private db: SqliteDriver | PostgresDriver

  constructor(config: Config) {
    const { type } = config
    if (type === 'sqlite') {
      this.db = new SqliteDriver(config)
    } else if (type === 'postgres') {
      this.db = new PostgresDriver(config)
    } else throw new Error(`DatabaseDriver: database "${type}" not supported`)
  }

  connect = async (): Promise<void> => {
    await this.db.connect()
  }

  disconnect = async (): Promise<void> => {
    await this.db.disconnect()
  }

  exec = async (query: string): Promise<void> => {
    await this.db.exec(query)
  }

  query = async <T>(
    text: string,
    values: (string | number)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    return this.db.query(text, values)
  }

  table = (name: string) => {
    return this.db.table(name)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    this.db.on(event, callback)
  }
}
