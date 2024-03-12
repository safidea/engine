import type { Driver } from '@adapter/spi/DatabaseTableSpi'
import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { FieldDto } from '@adapter/spi/dtos/FieldDto'
import type { PersistedDto, ToCreateDto, ToUpdateDto } from '@adapter/spi/dtos/RecordDto'
import { sql, Kysely } from 'kysely'
import SQLite from 'better-sqlite3'
import pg from 'pg'

export interface Schema {
  [key: string]: {
    [key: string]: unknown
  }
}

export class DatabaseTableDriver implements Driver {
  constructor(
    private name: string,
    private kysely: Kysely<Schema>,
    private db: SQLite.Database | pg.Pool
  ) {}

  exists = async () => {
    if (this.db instanceof pg.Pool) {
      const result = await this.kysely
        .selectFrom('information_schema.tables')
        .select('table_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .execute()
      return result.length > 0
    }
    if (this.db instanceof SQLite) {
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
    if (this.db instanceof pg.Pool) {
      const result = await this.kysely
        .selectFrom('information_schema.columns')
        .select('column_name')
        .where('table_schema', '=', 'public')
        .where('table_name', '=', this.name)
        .where('column_name', '=', name)
        .execute()
      return result.length > 0
    }
    if (this.db instanceof SQLite) {
      const fields = (await this.db.pragma(`table_info(${this.name})`)) as { name: string }[]
      return fields.some((field: { name: string }) => field.name === name)
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
    if (this.db instanceof SQLite) {
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
    if (this.db instanceof SQLite) {
      for (const key in persistedRecord) {
        const value = persistedRecord[key]
        if (value instanceof Date) {
          persistedRecord[key] = new Date(value)
        }
      }
    }
    return persistedRecord as PersistedDto
  }

  insertMany = async (recordtoCreateDtos: ToCreateDto[]): Promise<PersistedDto[]> => {
    if (this.db instanceof SQLite) {
      for (const recordtoCreateDto of recordtoCreateDtos) {
        for (const key in recordtoCreateDto) {
          const value = recordtoCreateDto[key]
          if (value instanceof Date) {
            recordtoCreateDto[key] = value.getTime()
          }
        }
      }
    }
    const persistedRecords = await this.kysely
      .insertInto(this.name)
      .values(recordtoCreateDtos)
      .returningAll()
      .execute()
    if (this.db instanceof SQLite) {
      for (const persistedRecord of persistedRecords) {
        for (const key in persistedRecord) {
          const value = persistedRecord[key]
          if (value instanceof Date) {
            persistedRecord[key] = new Date(value)
          }
        }
      }
    }
    return persistedRecords as PersistedDto[]
  }

  update = async (record: ToUpdateDto): Promise<PersistedDto> => {
    if (this.db instanceof SQLite) {
      for (const key in record) {
        const value = record[key]
        if (value instanceof Date) {
          record[key] = value.getTime()
        }
      }
    }
    const persistedRecord = await this.kysely
      .updateTable(this.name)
      .set(record)
      .where('id', '=', record.id)
      .returningAll()
      .executeTakeFirstOrThrow()
    if (this.db instanceof SQLite) {
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

  list = async (filters: FilterDto[]): Promise<PersistedDto[]> => {
    let query = this.kysely.selectFrom(this.name).selectAll()
    for (const filter of filters) {
      query = query.where(filter.field, filter.operator, filter.value)
    }
    const records = await query.execute()
    return records as PersistedDto[]
  }
}
