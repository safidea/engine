import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import type {
  IDatabase,
  IDatabaseInstance,
  IDatabaseRow,
  IDatabaseTable,
} from '@domain/drivers/IDatabase'
import type { Database } from './type'
import type { ILogger, ILoggerLog } from '@domain/drivers/ILogger'
import type { ITable } from '@domain/entities/table/ITable'

export class SqliteDatabase implements IDatabase {
  constructor(private logger: ILogger) {}

  create(tables: ITable[]) {
    return new SqliteDatabaseInstance(tables, this.logger)
  }
}

class SqliteDatabaseInstance implements IDatabaseInstance {
  private db: Kysely<Database>
  private log: ILoggerLog

  constructor(
    private tables: ITable[],
    private logger: ILogger
  ) {
    const dialect = new SqliteDialect({
      database: new SQLite(':memory:', { fileMustExist: true }),
    })
    this.db = new Kysely<Database>({ dialect })
    this.log = this.logger.init('database')
  }

  async migrate() {
    this.log('start migrating...')
    for (const table of this.tables) {
      const { name, fields } = table
      // TODO: check if table exists
      // TODO: check if table has all fields
      // TODO: add default fields in domain (id, created_at, updated_at)
      let query = this.db.schema
        .createTable(name)
        .addColumn('id', 'varchar', (col) => col.primaryKey())
      for (const field of fields) {
        const { name, type } = field
        if (type == 'SingleLineText') {
          query = query.addColumn(name, 'text')
        }
      }
      await query.execute()
      this.log(`successfuly migrate table "${table.name}"`)
    }
  }

  async disconnect(): Promise<void> {
    await this.db.destroy()
    this.log('disconnected')
  }

  table(name: string) {
    const log = this.logger.init('table:' + name)
    return new SqliteDatabaseTable(name, this.db, log)
  }
}

class SqliteDatabaseTable implements IDatabaseTable {
  constructor(
    private name: string,
    private db: Kysely<Database>,
    private log: ILoggerLog
  ) {}

  async insert(data: IDatabaseRow) {
    const [row] = await this.db.insertInto(this.name).values(data).returningAll().execute()
    this.log(`${this.name} inserted ${JSON.stringify(row)}`)
    return row
  }

  async read(data: IDatabaseRow) {
    return this.db
      .selectFrom(this.name)
      .selectAll()
      .where((eb) => eb.and(data))
      .executeTakeFirst()
  }
}
