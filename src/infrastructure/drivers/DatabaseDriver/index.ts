import type { Driver } from '@adapter/spi/DatabaseSpi'
import type { Config, EventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { SQLiteDriver } from './SQLiteDriver'
import { PostgreSQLDriver } from './PostgreSQLDriver'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

export class DatabaseDriver implements Driver {
  private _db: SQLiteDriver | PostgreSQLDriver

  constructor(config: Config) {
    const { driver } = config
    if (driver === 'SQLite') {
      this._db = new SQLiteDriver(config)
    } else if (driver === 'PostgreSQL') {
      this._db = new PostgreSQLDriver(config)
    } else throw new Error(`DatabaseDriver: database "${driver}" not supported`)
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
