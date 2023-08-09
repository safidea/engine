import { fakerFR as faker } from '@faker-js/faker'
import { RecordDto } from '@adapter/api/app/dtos/RecordDto'
import { Record, RecordFieldValue } from '@domain/entities/app/Record'
import { Field } from '@domain/entities/table/Field'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
import { SingleLineText } from '@domain/entities/table/fields/SingleLineText'
import { LongText } from '@domain/entities/table/fields/LongText'
import { MultipleLinkedRecords } from '@domain/entities/table/fields/MultipleLinkedRecords'
import { Datetime } from '@domain/entities/table/fields/Datetime'
import { SingleSelect } from '@domain/entities/table/fields/SingleSelect'
import { Formula } from '@domain/entities/table/fields/Formula'
import { Rollup } from '@domain/entities/table/fields/Rollup'
import { SingleLinkedRecord } from '@domain/entities/table/fields/SingleLinkedRecord'
import { NumberField } from '@domain/entities/table/fields/NumberField'
import { Currency } from '@domain/entities/table/fields/Currency'
import { RecordMapper } from '@adapter/api/app/mappers/RecordMapper'
import { Table } from '@domain/entities/table/Table'
import { getTablesDto } from './schema'

export function getTableByName(tableName: string): Table {
  const tablesDto = getTablesDto(tableName)
  const tableDto = tablesDto.find((tableDto) => tableDto.name === tableName)
  if (!tableDto) throw new Error(`Table ${tableName} not found`)
  return TableMapper.toEntity(tableDto)
}

export interface RecordsDtoByTables {
  [key: string]: RecordDto[]
}

export interface RecordsByTables {
  [key: string]: Record[]
}

export type ExtendRecordFieldValue = RecordFieldValue | RecordDto | RecordDto[]

export interface ExtendRecordDto {
  [key: string]: ExtendRecordFieldValue
}

export function generateRecordsDto(
  tableName: string,
  countOrRecordsDto: number | ExtendRecordDto[] = 1
): RecordsDtoByTables {
  const tables = generateRecords(tableName, countOrRecordsDto)
  const tablesDto: RecordsDtoByTables = {}
  for (const [table, records] of Object.entries(tables)) {
    tablesDto[table] = records.map((record) => RecordMapper.toDto(record))
  }
  return tablesDto
}

export function generateRecords(
  tableName: string,
  countOrRecordsDto: number | ExtendRecordDto[] = 1
): RecordsByTables {
  const table = getTableByName(tableName)
  const records: Record[] = []
  const length =
    typeof countOrRecordsDto === 'number' ? countOrRecordsDto : countOrRecordsDto.length
  for (let i = 0; i < length; i++) {
    const defaultValues: ExtendRecordDto =
      typeof countOrRecordsDto !== 'number' ? countOrRecordsDto[i] : {}
    const record = new Record({}, table, 'create', false)
    for (const field of table.fields) {
      const defaultValue = defaultValues[field.name]
      if (defaultValue || !field.optional || (field.optional && Math.random() > 0.5)) {
        if (field instanceof Formula || field instanceof Rollup) continue
        record.setFieldValue(
          field.name,
          generateRandomValueByField(field, records, record, defaultValue)
        )
      }
    }
    records.push(record)
  }
  const tables: RecordsByTables = {}
  for (const record of records) {
    if (!tables[record.tableName]) tables[record.tableName] = []
    tables[record.tableName].push(record)
  }
  return tables
}

export function generateRandomValueByField(
  field: Field,
  records: Record[],
  currentRecord: Record,
  defaultValue: ExtendRecordFieldValue
): RecordFieldValue {
  const { type, name } = field
  if (defaultValue && typeof defaultValue !== 'object') return defaultValue
  if (field instanceof SingleLineText || field instanceof LongText) {
    if (name.includes('email')) return faker.internet.email()
    if (name.includes('phone')) return faker.phone.number()
    if (name.includes('address')) return faker.location.streetAddress()
    if (name.includes('city')) return faker.location.city()
    if (name.includes('state')) return faker.location.state()
    if (name.includes('zip')) return faker.location.zipCode()
    if (name.includes('country')) return faker.location.country()
    if (name.includes('firstName')) return faker.person.firstName()
    if (name.includes('lastName')) return faker.person.lastName()
    if (name.includes('fullname')) return faker.person.fullName()
    if (name.includes('company') || name.includes('organization') || name.includes('customer'))
      return faker.company.name()
    if (name.includes('domain')) return faker.internet.domainName()
    if (name.includes('title')) return faker.person.jobTitle()
    if (name.includes('description')) return faker.lorem.paragraph()
    if (name.includes('url')) return faker.internet.url()
    if (name.includes('image')) return faker.image.url()
    if (name.includes('color')) return faker.internet.color()
    if (name.includes('username')) return faker.internet.userName()
    if (name.includes('password')) return faker.internet.password()
    if (name.includes('text')) return faker.lorem.text()
    if (name.includes('unit')) return faker.commerce.productName()
    if (name.includes('number')) return String(faker.number.int(1000))
    return faker.word.words()
  }
  if (field instanceof NumberField) {
    if (name.includes('quantity')) return faker.number.int(50)
    return faker.number.int(1000)
  }
  if (field instanceof Currency) {
    if (name.includes('price')) return faker.number.float({ max: 1000, precision: 0.01 })
    return faker.number.float({ precision: 0.01 })
  }
  if (field instanceof MultipleLinkedRecords) {
    const linkedRecordsdefaultValues: RecordDto[] = []
    const linkedRecords: string[] = []
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        for (const value of defaultValue) {
          if (typeof value !== 'string') {
            linkedRecordsdefaultValues.push(value)
          } else {
            linkedRecords.push(value)
          }
        }
      } else {
        throw new Error(
          `MultipleLinkedRecords field ${field.name} must have an array of RecordDto as default value`
        )
      }
    }
    if (linkedRecords.length > 0) return linkedRecords
    const linkedTable = getTableByName(field.table)
    const linkedField = linkedTable.getLinkedFieldByLinkedTableName(currentRecord.tableName)
    const { [field.table]: newRecords } = generateRecords(
      field.table,
      Array.from({
        length: linkedRecordsdefaultValues.length > 0 ? linkedRecordsdefaultValues.length : 3,
      }).map((_, index) => ({
        [linkedField.name]: currentRecord.id,
        ...(linkedRecordsdefaultValues[index] ?? {}),
      }))
    )
    records.push(...newRecords)
    return newRecords.map((record) => record.id)
  }
  if (field instanceof SingleLinkedRecord) {
    let linkedRecordDefaultValues: RecordDto = {}
    if (
      defaultValue &&
      typeof defaultValue !== 'string' &&
      typeof defaultValue !== 'boolean' &&
      typeof defaultValue !== 'number' &&
      !Array.isArray(defaultValue)
    ) {
      linkedRecordDefaultValues = defaultValue
    } else if (defaultValue && typeof defaultValue === 'string') {
      return defaultValue
    }
    const linkedTable = getTableByName(field.table)
    const linkedField = linkedTable.getLinkedFieldByLinkedTableName(currentRecord.tableName)
    const {
      [field.table]: [record],
    } = generateRecords(field.table, [
      { [linkedField.name]: currentRecord.id, ...linkedRecordDefaultValues },
    ])
    records.push(record)
    return record.id
  }
  if (field instanceof Datetime) {
    return faker.date.past().toISOString()
  }
  if (field instanceof SingleSelect) {
    return field.default ?? faker.helpers.arrayElement(field.options)
  }
  throw new Error(`Unknown type ${type} in faker generator`)
}
