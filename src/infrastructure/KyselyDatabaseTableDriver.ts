import type { DatabaseTableDriver } from '@adapter/spi/DatabaseTableSPI'
import type { DatabaseFilterDto } from '@adapter/spi/dtos/DatabaseFilterDto'
import type { DatabaseTableColumnDto } from '@adapter/spi/dtos/DatabaseTableColumnDto'
import type { PersistedRecordDto } from '@adapter/spi/dtos/PersistedRecordDto'
import type { ToCreateRecordDto } from '@adapter/spi/dtos/ToCreateRecordDto'
import { Kysely } from 'kysely'

export interface Database {
  [key: string]: {
    [key: string]: unknown
  }
}

export class KyselyDatabaseTable implements DatabaseTableDriver {
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

  async insert(recordtoCreateDto: ToCreateRecordDto): Promise<PersistedRecordDto> {
    const persistedRecord = await this.db
      .insertInto(this.name)
      .values(recordtoCreateDto)
      .returningAll()
      .executeTakeFirstOrThrow()
    return persistedRecord as PersistedRecordDto
  }

  async read(filters: DatabaseFilterDto[]): Promise<PersistedRecordDto | undefined> {
    let query = this.db.selectFrom(this.name).selectAll()
    for (const filter of filters) {
      query = query.where(filter.column, filter.operator, filter.value)
    }
    const record = await query.executeTakeFirst()
    return record as PersistedRecordDto | undefined
  }
}
