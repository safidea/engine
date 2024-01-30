import type { RecordDto } from '@adapter/spi/dtos/RecordDto'
import type { IDatabaseDriver } from '@adapter/spi/drivers/IDatabaseDriver'
import type { IDatabaseTableDriver } from '@adapter/spi/drivers/IDatabaseTableDriver'
import type { DatabaseTableColumnDto } from '@adapter/spi/dtos/DatabaseTableColumnDto'
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

export interface Database {
  [key: string]: RecordDto
}

export class DatabaseDriver implements IDatabaseDriver {
  private db: Kysely<Database>

  constructor() {
    const dialect = new SqliteDialect({
      database: new SQLite(':memory:', { fileMustExist: true }),
    })
    this.db = new Kysely<Database>({ dialect })
  }

  async disconnect(): Promise<void> {
    await this.db.destroy()
  }

  table(name: string) {
    return new DatabaseTable(name, this.db)
  }
}

class DatabaseTable implements IDatabaseTableDriver {
  constructor(
    private name: string,
    private db: Kysely<Database>
  ) {}

  async create(columns: DatabaseTableColumnDto[]) {
    let query = this.db.schema.createTable(this.name)
    columns.forEach(({ name, type }) => {
      query = query.addColumn(name, type)
    })
    await query.execute()
  }

  async addColumn(column: DatabaseTableColumnDto) {
    await this.db.schema.alterTable(this.name).addColumn(column.name, column.type).execute()
  }

  async dropColumn(name: string) {
    await this.db.schema.alterTable(this.name).dropColumn(name).execute()
  }

  async drop() {
    await this.db.schema.dropTable(this.name).execute()
  }

  async insert(recordDto: RecordDto) {
    return this.db.insertInto(this.name).values(recordDto).returningAll().executeTakeFirstOrThrow()
  }

  async read(recordFilter: RecordDto) {
    return this.db
      .selectFrom(this.name)
      .selectAll()
      .where((eb) => eb.and(recordFilter))
      .executeTakeFirst()
  }
}
