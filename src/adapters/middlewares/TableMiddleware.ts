import { App } from '@entities/app/App'
import { TableController } from '../controllers/TableController'
import { TableValidator } from '../validators/TableValidator'
import { ServerResponse } from '@adapters/services/server/ServerResponse'
import { ServerRequest } from '@adapters/services/server/ServerRequest'
import { Table } from '@entities/app/table/Table'
import { ApiError } from '@entities/errors/ApiError'
import { RecordMapper } from '@adapters/mappers/RecordMapper'
import { FilterMapper } from '@adapters/mappers/FilterMapper'
import { SyncMapper } from '@adapters/mappers/SyncMapper'

export class TableMiddleware {
  private readonly tableController: TableController
  private readonly tableValidator: TableValidator

  constructor(readonly app: App) {
    this.tableValidator = new TableValidator(app)
    this.tableController = new TableController(app)
  }

  sync() {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const syncDto = await this.tableValidator.validateSyncBody(request.body)
        const { records, resources } = await SyncMapper.toSync(syncDto, this.app)
        const recordsByTables = await this.tableController.sync(records, resources)
        const recordsByTablesDtos = SyncMapper.toRecordsByTable(recordsByTables)
        return { json: { tables: recordsByTablesDtos } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  get(table: Table) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const filtersDto = await this.tableValidator.extractAndValidateFilters(request)
        const filters = FilterMapper.toManyFilters(filtersDto)
        const records = await this.tableController.list(table, filters)
        const recordsDtos = RecordMapper.toManyDtos(records)
        return { json: { records: recordsDtos } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  getById(table: Table) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const record = await this.tableValidator.validateRecordExist(request, table)
        const recordDto = RecordMapper.toDto(record)
        return { json: { record: recordDto } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  post(table: Table) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        if (Array.isArray(request.body)) {
          const recordsDtos = await this.tableValidator.validateRecordsToCreateBody(request.body)
          const records = RecordMapper.toManyCreates(recordsDtos, table)
          const ids = await this.tableController.createMany(table, records)
          return { json: { ids } }
        }
        const recordDto = await this.tableValidator.validateRecordToCreateBody(request.body)
        const record = RecordMapper.toCreate(recordDto, table)
        const id = await this.tableController.create(table, record)
        return { json: { id } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  patchById(table: Table) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const persistedRecord = await this.tableValidator.validateRecordExist(request, table)
        const updatedRecordDto = await this.tableValidator.validateRecordToUpdateBody(request.body)
        const updatedRecord = RecordMapper.toUpdate(persistedRecord, table, updatedRecordDto)
        await this.tableValidator.validateUpdatePermissions(persistedRecord, updatedRecord)
        await this.tableController.update(table, updatedRecord)
        return { json: { id: updatedRecord.id } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  deleteById(table: Table) {
    return async (request: ServerRequest): Promise<ServerResponse> => {
      try {
        const record = await this.tableValidator.validateRecordExist(request, table)
        await this.tableController.delete(table, record.softDelete())
        return { json: { id: record.id } }
      } catch (error) {
        return this.catchError(error)
      }
    }
  }

  private catchError(error: unknown): ServerResponse {
    if (error instanceof ApiError) {
      return { status: error.status, json: { error: error.message } }
    } else if (error instanceof Error) {
      return { status: 500, json: { error: error.message } }
    } else {
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }
}
