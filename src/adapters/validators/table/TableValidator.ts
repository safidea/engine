import reporter from 'io-ts-reporters'
import { isLeft } from 'fp-ts/Either'
import { ServerRequest } from '@adapters/services/server/ServerRequest'
import { App } from '@entities/app/App'
import { Table } from '@entities/app/table/Table'
import { ApiError } from '@entities/errors/ApiError'
import { PersistedRecord } from '@entities/services/database/record/state/persisted/PersistedRecord'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { RecordBodyDto } from '@adapters/dtos/RecordDto'
import { SyncDto } from '@adapters/dtos/SyncDto'
import { FilterDto } from '@adapters/dtos/FilterDto'

export class TableValidator {
  constructor(private app: App) {}

  public async extractAndValidateFilters(request: ServerRequest): Promise<FilterDto[]> {
    const { query } = request
    const filters: FilterDto[] = []
    if (query) {
      for (const key in query) {
        const matchFilter = key.match(/filter_(field|operator|value)_(\d+)$/)
        if (matchFilter) {
          const index = Number(matchFilter[2])
          const value = query[key]
          filters[index] = filters[index] || {}
          if (key.startsWith('filter_field_')) {
            filters[index].field = value
          } else if (key.startsWith('filter_operator_')) {
            if (value === 'is_any_of') {
              filters[index].operator = value
            } else {
              throw new ApiError(`operator "${value}" is not supported`, 400)
            }
          } else if (key.startsWith('filter_value_')) {
            if (filters[index].operator === 'is_any_of') {
              filters[index].value = value.split(',')
            }
          }
        }
      }
    }
    return filters
  }

  public async validateSyncBody(body: unknown): Promise<SyncDto> {
    const decoded = SyncDto.decode(body)
    if (isLeft(decoded)) {
      throw Error(`Could not validate sync body:\n${reporter.report(decoded).join('\n')}`)
    }
    const sync: SyncDto = decoded.right
    return sync
  }

  public async validateRecordExist(request: ServerRequest, table: Table): Promise<PersistedRecord> {
    const { id } = request.params ?? {}
    const record = await this.app.tables.services.database.read(table, id)
    if (!record) throw new ApiError(`record "${id}" does not exist in table "${table.name}"`, 404)
    return record
  }

  public async validateRecordBody(body: unknown): Promise<RecordBodyDto> {
    const decoded = RecordBodyDto.decode(body)
    if (isLeft(decoded)) {
      throw Error(`Could not validate record body:\n${reporter.report(decoded).join('\n')}`)
    }
    const recordDto: RecordBodyDto = decoded.right
    return recordDto
  }

  public async validateRecordsBody(body: unknown[]): Promise<RecordBodyDto[]> {
    const records = []
    for (const record of body) {
      records.push(this.validateRecordBody(record))
    }
    return Promise.all(records)
  }

  public async validateUpdatePermissions(
    persistedRecord: PersistedRecord,
    updatedRecord: RecordToUpdate
  ): Promise<void> {
    try {
      updatedRecord.validateFieldsPermissions(persistedRecord)
    } catch (error) {
      if (error instanceof Error) throw new ApiError(error.message, 400)
      throw error
    }
  }
}
