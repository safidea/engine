import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto } from '@adapter/spi/dtos/RecordDto'
import { sql, Kysely } from 'kysely'

export interface Schema {
  [key: string]: {
    [key: string]: unknown
  }
}

export class DatabaseTableDriver implements Driver {
  constructor(
    private name: string,
    private kysely: Kysely<Schema>,
    private db: 'sqlite' | 'postgres'
  ) {}

  exists = async () => {
    if (this.db === 'postgres') {
      const result = await this.kysely
        .selectFrom('information_schema.tables')
        .select('table_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .execute()
      return result.length > 0
    }
    if (this.db === 'sqlite') {
      const result = await this.kysely
        .selectFrom('sqlite_master')
        .select('name')
        .where('type', '=', 'table')
        .where('name', '=', this.name)
        .execute()
      return result.length > 0
    }
    throw new Error(`Database ${this.db} not supported`)
  }

  create = async (fields: FieldDto[]) => {
    let query = this.kysely.schema.createTable(this.name)
    fields.forEach(({ name, type }) => {
      query = query.addColumn(name, type)
    })
    await query.execute()
  }

  fieldExists = async (name: string) => {
    if (this.db === 'postgres') {
      const result = await this.kysely
        .selectFrom('information_schema.columns')
        .select('column_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .where('column_name', '=', name)
        .execute()
      return result.length > 0
    }
    if (this.db === 'sqlite') {
      const { rows } = await sql<{ name: string }>`PRAGMA table_info(${this.name})`.execute(
        this.kysely
      )
      const exists = rows.find((column) => column.name === name) !== undefined
      return exists
    }
    throw new Error(`Database ${this.db} not supported`)
  }

  addField = async (field: FieldDto) => {
    await this.kysely.schema.alterTable(this.name).addColumn(field.name, field.type).execute()
  }

  alterField = async (field: FieldDto) => {
    await sql`
      ALTER TABLE ${this.name}
      ALTER COLUMN ${field.name}}
      SET DATA TYPE ${field.type};
    `.execute(this.kysely)
  }

  dropField = async (name: string) => {
    await this.kysely.schema.alterTable(this.name).dropColumn(name).execute()
  }

  drop = async () => {
    await this.kysely.schema.dropTable(this.name).execute()
  }

  insert = async (recordtoCreateDto: ToCreateDto): Promise<PersistedDto> => {
    if (this.db === 'sqlite') {
      for (const key in recordtoCreateDto) {
        const value = recordtoCreateDto[key]
        if (value instanceof Date) {
          recordtoCreateDto[key] = value.getTime()
        }
      }
    }
    const persistedRecord = await this.kysely
      .insertInto(this.name)
      .values(recordtoCreateDto)
      .returningAll()
      .executeTakeFirstOrThrow()
    if (this.db === 'sqlite') {
      for (const key in persistedRecord) {
        const value = persistedRecord[key]
        if (value instanceof Date) {
          persistedRecord[key] = new Date(value)
        }
      }
    }
    return persistedRecord as PersistedDto
  }

  read = async (filters: FilterDto[]): Promise<PersistedDto | undefined> => {
    let query = this.kysely.selectFrom(this.name).selectAll()
    for (const filter of filters) {
      query = query.where(filter.field, filter.operator, filter.value)
    }
    const record = await query.executeTakeFirst()
    return record as PersistedDto | undefined
  }
}
