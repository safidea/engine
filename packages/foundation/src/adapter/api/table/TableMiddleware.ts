import { FilterDto } from '@adapter/api/app/dtos/FilterDto'
import { App } from '@domain/entities/app/App'
import { ApiError } from '@domain/entities/app/errors/ApiError'
import { RequestDto } from '@adapter/spi/server/dtos/RequestDto'
import { RecordDto } from '@adapter/api/app/dtos/RecordDto'
import { FilterMapper } from '@adapter/api/app/mappers/FilterMapper'
import { Filter } from '@domain/entities/app/Filter'
import { RecordMapper } from '@adapter/api/app/mappers/RecordMapper'
import { Record, RecordState } from '@domain/entities/app/Record'
import { OrmGateway } from '@adapter/spi/orm/OrmGateway'
import { validateRecordDto, validateSyncDto } from '../utils/AjvUtils'
import { SyncResource } from '@domain/entities/app/Sync'
import { SyncResourceMapper } from '../app/mappers/sync/SyncResourceMapper'

export class TableMiddleware {
  constructor(
    private app: App,
    private ormGateway: OrmGateway
  ) {}

  public async validateTableExist(request: RequestDto): Promise<string> {
    const { table } = request.params ?? {}
    const exist = await this.ormGateway.tableExists(table)
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
      const resources = SyncResourceMapper.toEntities(resourcesDto)
      return { records, resources }
    }
    throw new ApiError(`sync body is not valid`, 400)
  }

  public async validateRecordExist(request: RequestDto): Promise<string> {
    const { table, id } = request.params ?? {}
    const record = await this.ormGateway.read(table, id)
    if (!record) throw new ApiError(`record "${id}" does not exist in table "${table}"`, 404)
    return id
  }

  public async validateRecordBody(
    table: string,
    body: unknown,
    state: RecordState
  ): Promise<Record> {
    if (validateRecordDto(body)) return this.validateRecordValues(table, body, state)
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
        records.push(this.validateRecordBody(table, record, state))
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
}
