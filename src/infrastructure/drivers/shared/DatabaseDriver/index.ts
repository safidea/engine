import type { IDatabaseDriver } from '@adapter/spi/drivers/DatabaseSpi'
import type { DatabaseConfig, DatabaseEventType } from '@domain/services/Database'
import type { EventDto } from '@adapter/spi/dtos/EventDto'
import { PostgreSQLDatabaseDriver } from '@infrastructure/drivers/shared/DatabaseDriver/PostgreSQLDriver'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'

export class DatabaseDriver implements IDatabaseDriver {
  private _db: PostgreSQLDatabaseDriver

  constructor(config: DatabaseConfig) {
    const { driver } = config
    switch (driver) {
      case 'SQLite':
        throw new Error('You have to import the SQLite driver from Bun or Node modules')
      case 'PostgreSQL':
        this._db = new PostgreSQLDatabaseDriver(config)
        break
      default:
        throw new Error('Invalid driver')
    }
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

  table(name: string, fields: FieldDto[] = []) {
    return this._db.table(name, fields)
  }

  on = (event: DatabaseEventType, callback: (eventDto: EventDto) => void) => {
    this._db.on(event, callback)
  }

  setupTriggers = async (tables: string[]) => {
    await this._db.setupTriggers(tables)
  }
}
