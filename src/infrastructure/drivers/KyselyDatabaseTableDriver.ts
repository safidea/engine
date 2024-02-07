import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { DatabaseFilterDto } from '@adapter/spi/dtos/DatabaseFilterDto'
import type { DatabaseTableFieldDto } from '@adapter/spi/dtos/DatabaseTableFieldDto'
import type { PersistedDto, ToCreateDto } from '@adapter/spi/dtos/RecordDto'
import { sql, Kysely } from 'kysely'

export interface Database {
  [key: string]: {
    [key: string]: unknown
  }
}

export class KyselyDatabaseTable implements Driver {
  constructor(
    private name: string,
    private db: Kysely<Database>,
    private database: 'sqlite' | 'postgres'
  ) {}

  async exists() {
    if (this.database === 'postgres') {
      const result = await this.db
        .selectFrom('information_schema.tables')
        .select('table_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .execute()
      return result.length > 0
    }
    if (this.database === 'sqlite') {
      const result = await this.db
        .selectFrom('sqlite_master')
        .select('name')
        .where('type', '=', 'table')
        .where('name', '=', this.name)
        .execute()
      return result.length > 0
    }
    throw new Error(`Database ${this.database} not supported`)
  }

  async create(fields: DatabaseTableFieldDto[]) {
    let query = this.db.schema.createTable(this.name)
    fields.forEach(({ name, type }) => {
      query = query.addColumn(name, type)
    })
    await query.execute()
  }

  async fieldExists(name: string) {
    if (this.database === 'postgres') {
      const result = await this.db
        .selectFrom('information_schema.columns')
        .select('column_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .where('column_name', '=', name)
        .execute()
      return result.length > 0
    }
    if (this.database === 'sqlite') {
      const { rows } = await sql<{ name: string }>`PRAGMA table_info(${this.name})`.execute(this.db)
      const exists = rows.find((column) => column.name === name) !== undefined
      return exists
    }
    throw new Error(`Database ${this.database} not supported`)
  }

  async addField(field: DatabaseTableFieldDto) {
    await this.db.schema.alterTable(this.name).addColumn(field.name, field.type).execute()
  }

  async alterField(field: DatabaseTableFieldDto) {
    await sql`
      ALTER TABLE ${this.name}
      ALTER COLUMN ${field.name}}
      SET DATA TYPE ${field.type};
    `.execute(this.db)
  }

  async dropField(name: string) {
    await this.db.schema.alterTable(this.name).dropColumn(name).execute()
  }

  async drop() {
    await this.db.schema.dropTable(this.name).execute()
  }

  async insert(recordtoCreateDto: ToCreateDto): Promise<PersistedDto> {
    if (this.database === 'sqlite') {
      for (const key in recordtoCreateDto) {
        const value = recordtoCreateDto[key]
        if (value instanceof Date) {
          recordtoCreateDto[key] = value.getTime()
        }
      }
    }
    const persistedRecord = await this.db
      .insertInto(this.name)
      .values(recordtoCreateDto)
      .returningAll()
      .executeTakeFirstOrThrow()
    if (this.database === 'sqlite') {
      for (const key in persistedRecord) {
        const value = persistedRecord[key]
        if (value instanceof Date) {
          persistedRecord[key] = new Date(value)
        }
      }
    }
    return persistedRecord as PersistedDto
  }

  async read(filters: DatabaseFilterDto[]): Promise<PersistedDto | undefined> {
    let query = this.db.selectFrom(this.name).selectAll()
    for (const filter of filters) {
      query = query.where(filter.field, filter.operator, filter.value)
    }
    const record = await query.executeTakeFirst()
    return record as PersistedDto | undefined
  }
}
