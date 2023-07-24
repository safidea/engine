import { v4 as uuidv4 } from 'uuid'
import { TableRepository } from '@adapter/spi/repositories/TableRepository'
import { RecordDto, RecordToCreateDto } from '@application/dtos/RecordDto'
import { mapDtoToRecord } from '@application/mappers/RecordMapper'
import { MultipleLinkedRecords } from '@domain/entities/fields/MultipleLinkedRecords'
import { SingleLinkRecord } from '@domain/entities/fields/SingleLinkedRecord'
import { CreateManyTableRecord } from './CreateManyTableRecord'

export class CreateTableRecord {
  constructor(private tableRepository: TableRepository) {}

  async execute(table: string, recordToCreateDto: RecordToCreateDto): Promise<string> {
    const recordDto = await this.buildRecordDto(table, recordToCreateDto)
    return this.tableRepository.create(table, mapDtoToRecord(table, recordDto))
  }

  async buildRecordDto(table: string, recordToCreateDto: RecordToCreateDto): Promise<RecordDto> {
    const fields = await this.tableRepository.getTableFields(table)
    const recordDto: RecordDto = {
      id: uuidv4(),
      created_time: new Date().toISOString(),
    }
    for (const fieldName in recordToCreateDto) {
      const field = fields.find((f) => f.name === fieldName)
      if (!field) throw new Error(`Field ${fieldName} not found`)
      const value = recordToCreateDto[fieldName]
      if (typeof value === 'object' && 'create' in value) {
        if (field instanceof MultipleLinkedRecords) {
          if (!Array.isArray(value.create))
            throw new Error(`Property create of field ${fieldName} must be an array`)
          const createManyTableRecord = new CreateManyTableRecord(this.tableRepository)
          const linkedField = await this.getLinkedFields(field.table, table)
          if (!linkedField) throw new Error(`Linked field not found for table ${field.table}`)
          recordDto[fieldName] = await createManyTableRecord.execute(
            field.table,
            value.create.map((record) => ({
              ...record,
              [linkedField.name]:
                linkedField.type === 'single_linked_record'
                  ? String(recordDto.id)
                  : [String(recordDto.id)],
            }))
          )
        }
        if (field instanceof SingleLinkRecord) {
          if (Array.isArray(value.create))
            throw new Error(`Property create of field ${fieldName} must not be an array`)
          const linkedField = await this.getLinkedFields(field.table, table)
          if (!linkedField) throw new Error(`Linked field not found for table ${field.table}`)
          recordDto[fieldName] = await this.execute(field.table, {
            ...value.create,
            [linkedField.name]:
              linkedField.type === 'single_linked_record'
                ? String(recordDto.id)
                : [String(recordDto.id)],
          })
        }
      } else {
        recordDto[fieldName] = value
      }
    }
    return recordDto
  }

  async getLinkedFields(fromTableName: string, toTableName: string) {
    const fields = await this.tableRepository.getTableFields(fromTableName)
    return fields.find(
      (field) =>
        ['single_linked_record', 'multiple_linked_records'].includes(field.type) &&
        'table' in field &&
        field.table === toTableName
    )
  }
}
