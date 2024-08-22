import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { SqliteDriver } from './SqliteDriver'
import { PostgresDriver } from './PostgresDriver'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

export class DatabaseDriver implements Driver {
  private _db: SqliteDriver | PostgresDriver

  constructor(config: Config) {
    const { type } = config
    if (type === 'sqlite') {
      this._db = new SqliteDriver(config)
    } else if (type === 'postgres') {
      this._db = new PostgresDriver(config)
    } else throw new Error(`DatabaseDriver: database "${type}" not supported`)
  }

  connect = async (): Promise<void> => {
    await this._db.connect()
  }

  disconnect = async (): Promise<void> => {
    await this._db.disconnect()
  }

  exec = async (query: string): Promise<void> => {
    await this._db.exec(query)
  }

  query = async <T>(
    text: string,
    values: (string | number | Buffer | Date)[]
  ): Promise<{ rows: T[]; rowCount: number }> => {
    return this._db.query(text, values)
  }

  table(name: string, fields: FieldDto[]) {
    return this._db.table(name, fields)
  }

  on = (event: EventType, callback: (eventDto: EventDto) => void) => {
    this._db.on(event, callback)
  }

  setupTriggers = async (tables: string[]) => {
    await this._db.setupTriggers(tables)
  }
}
