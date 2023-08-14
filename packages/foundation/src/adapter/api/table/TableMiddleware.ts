import Ajv from 'ajv'
import { FilterDto } from '@adapter/api/app/dtos/FilterDto'
import { App } from '@domain/entities/app/App'
import { ApiError } from '@domain/entities/app/errors/ApiError'
import { RequestDto } from '@adapter/spi/server/dtos/RequestDto'
import { RecordDto, RecordDtoSchema } from '@adapter/api/app/dtos/RecordDto'
import { FilterMapper } from '@adapter/api/app/mappers/FilterMapper'
import { Filter } from '@domain/entities/app/Filter'
import { RecordMapper } from '@adapter/api/app/mappers/RecordMapper'
import { Record, RecordState } from '@domain/entities/app/Record'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { SyncResource } from '@domain/entities/app/Sync'
import { ResourceSyncMapper } from '../app/mappers/sync/ResourceSyncMapper'
import { SyncDtoSchema } from '../app/dtos/SyncDto'

const ajv = new Ajv({ allowUnionTypes: true })
const validateRecordDto = ajv.compile(RecordDtoSchema)
const validateSyncDto = ajv.compile(SyncDtoSchema)

export class TableMiddleware {
  constructor(
    private app: App,
    private ormSpi: OrmSpi
  ) {}

  public async validateTableExist(request: RequestDto): Promise<string> {
    const { table } = request.params ?? {}
    const exist = await this.ormSpi.tableExists(table)
    if (!exist) throw new ApiError(`table "${table}" does not exist`, 404)
    return table
  }

  public async extractAndValidateQuery(request: RequestDto): Promise<Filter[]> {
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
    return FilterMapper.toEntities(filters)
  }

  public async validateSyncBody(
    body: unknown
  ): Promise<{ records: Record[]; resources: SyncResource[] }> {
    if (validateSyncDto(body)) {
      const { commands: commandsDto = [], resources: resourcesDto = [] } = body
      const records = await Promise.all(
        commandsDto.map((commandDto) => {
          const { type, table, record: recordDto } = commandDto
          return this.validateRecordValues(table, recordDto, type)
        })
      )
      const resources = ResourceSyncMapper.toEntities(resourcesDto)
      return { records, resources }
    }
    throw new ApiError(`sync body is not valid`, 400)
  }

  public async validateRecordExist(request: RequestDto): Promise<Record> {
    const { table, id } = request.params ?? {}
    const record = await this.ormSpi.read(table, id)
    if (!record) throw new ApiError(`record "${id}" does not exist in table "${table}"`, 404)
    return record
  }

  public async validateRecordBody(table: string, body: unknown): Promise<RecordDto> {
    if (validateRecordDto(body)) return body
    throw new ApiError(`record body is not valid`, 400)
  }

  public async validateRecordsBody(
    table: string,
    body: unknown[],
    state: RecordState
  ): Promise<Record[]> {
    const records = []
    for (const record of body) {
      if (validateRecordDto(record)) {
        records.push(this.validateRecordValues(table, record, state))
      } else {
        throw new ApiError(`record in the body array is not valid`, 400)
      }
    }
    return Promise.all(records)
  }

  public async validateRecordValues(
    table: string,
    record: RecordDto,
    state: RecordState
  ): Promise<Record> {
    try {
      return RecordMapper.toEntity(record, this.app.getTableByName(table), state)
    } catch (error) {
      if (error instanceof Error) throw new ApiError(error.message, 400)
      throw error
    }
  }

  public async validateUpdatePermissions(
    persistedRecord: Record,
    updatedRecord: Record
  ): Promise<void> {
    try {
      updatedRecord.validateFieldsPermissions(persistedRecord.fields)
    } catch (error) {
      if (error instanceof Error) throw new ApiError(error.message, 400)
      throw error
    }
  }
}
