import { fakerFR as faker } from '@faker-js/faker'
import { v4 as uuidV4 } from 'uuid'
import fs from 'fs-extra'
import { join } from 'path'
import { AppDto } from '@adapters/dtos/AppDto'
import { TableParams } from '@entities/app/table/TableParams'
import { IDatabaseDriver } from '@adapters/services/database/IDatabaseDriver'
import { RecordData, RecordFieldValue } from '@entities/services/database/record/RecordData'
import { FieldParams } from '@entities/app/table/field/FieldParams'
import { RecordToCreateDto } from '@adapters/dtos/RecordDto'

export function getUrl(port: number, path: string): string {
  return `http://localhost:${port}${path}`
}

export function copyAppFile(appName: string, filePath: string, testDolder: string): void {
  const sourcePath = join(process.cwd(), 'specs/e2e', appName, filePath)
  const destinationPath = join(testDolder, filePath)
  fs.ensureFileSync(destinationPath)
  fs.copyFileSync(sourcePath, destinationPath)
}

export function getTableByName(appDto: AppDto, tableName: string): TableParams {
  const tablesDto = appDto.tables ?? []
  const tableDto = tablesDto.find((tableDto) => tableDto.name === tableName)
  if (!tableDto) throw new Error(`Table ${tableName} not found`)
  return tableDto
}

export interface RecordDataTable {
  table: string
  fields: RecordToCreateDto
}
export interface RecordsDtoByTables {
  [key: string]: RecordToCreateDto[]
}

export type ExtendRecordFieldValue = RecordFieldValue | RecordToCreateDto | RecordToCreateDto[]

export interface ExtendRecordData {
  [key: string]: ExtendRecordFieldValue
}

export async function generateRecords(
  appDto: AppDto,
  database: IDatabaseDriver,
  tableName: string,
  countOrRecordsDto: number | ExtendRecordData[] = 1
): Promise<RecordsDtoByTables> {
  const tables = generateRecordsDto(appDto, tableName, countOrRecordsDto)
  await database.configure(appDto.tables ?? [])
  for (const table in tables) {
    await database.createMany(table, tables[table])
  }
  return tables
}

export function generateRecordsDto(
  appDto: AppDto,
  tableName: string,
  countOrRecordsDto: number | ExtendRecordData[] = 1
): RecordsDtoByTables {
  const tableDto = getTableByName(appDto, tableName)
  const records: RecordDataTable[] = []
  const length =
    typeof countOrRecordsDto === 'number' ? countOrRecordsDto : countOrRecordsDto.length
  for (let i = 0; i < length; i++) {
    const defaultValues: ExtendRecordData =
      typeof countOrRecordsDto !== 'number' ? countOrRecordsDto[i] : {}
    const record: RecordDataTable = {
      table: tableName,
      fields: {
        id: uuidV4(),
        created_time: new Date().toISOString(),
      },
    }
    for (const field of tableDto.fields) {
      const defaultValue = defaultValues[field.name]
      if (field.name in defaultValues || !field.optional) {
        if (
          field.type === 'formula' ||
          field.type === 'rollup' ||
          field.type === 'autonumber' ||
          (field.name in defaultValues && defaultValue === undefined)
        )
          continue
        record.fields[field.name] = generateRandomValueByField(
          appDto,
          field,
          records,
          record,
          defaultValue
        )
      }
    }
    records.push(record)
  }
  const tables: RecordsDtoByTables = {}
  for (const record of records) {
    if (!tables[record.table]) tables[record.table] = []
    tables[record.table].push(record.fields)
  }
  return tables
}

export function generateRandomValueByField(
  appDto: AppDto,
  field: FieldParams,
  records: RecordDataTable[],
  currentRecord: RecordDataTable,
  defaultValue: ExtendRecordFieldValue
): RecordFieldValue {
  const { type, name, default: nativeDefaultValue } = field
  if (defaultValue && typeof defaultValue !== 'object') {
    return defaultValue
  } else if (nativeDefaultValue) {
    return nativeDefaultValue
  } else if (['single_line_text', 'long_text'].includes(type)) {
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
    if (
      name.includes('company') ||
      name.includes('organization') ||
      name.includes('customer') ||
      name.includes('name')
    )
      return faker.company.name()
    if (name.includes('domain')) return faker.internet.domainName()
    if (name.includes('title')) return faker.person.jobTitle()
    if (name.includes('activity')) return faker.commerce.product()
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
  } else if (['number'].includes(type)) {
    if (name.includes('quantity')) return faker.number.int(10)
    return faker.number.int(1000)
  } else if (['currency'].includes(type)) {
    if (name.includes('price')) return faker.number.float({ max: 10, precision: 0.01 })
    return faker.number.float({ max: 10, precision: 0.01 })
  } else if (type === 'multiple_linked_records') {
    const linkedRecordsdefaultValues: RecordToCreateDto[] = []
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
          `multiple_linked_records field ${field.name} must have an array of RecordData as default value`
        )
      }
    }
    if (linkedRecords.length > 0) return linkedRecords
    const linkedTable = getTableByName(appDto, field.table)
    const linkedField = linkedTable.fields.find((f) => f.type === 'single_linked_record')
    if (!linkedField)
      throw new Error(`single_linked_record field not found for table ${field.table}`)
    const { [field.table]: newRecords } = generateRecordsDto(
      appDto,
      field.table,
      Array.from({
        length: linkedRecordsdefaultValues.length > 0 ? linkedRecordsdefaultValues.length : 3,
      }).map((_, index) => ({
        [linkedField.name]: currentRecord.fields.id,
        ...(linkedRecordsdefaultValues[index] ?? {}),
      }))
    )
    const newTableRecords = newRecords.map((record) => ({ table: field.table, fields: record }))
    records.push(...newTableRecords)
    return newTableRecords.map((record) => String(record.fields.id))
  } else if (type === 'single_linked_record') {
    let linkedRecordDefaultValues = {}
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
    const linkedTable = getTableByName(appDto, field.table)
    const linkedField = linkedTable.fields.find((f) => f.type === 'multiple_linked_records')
    if (!linkedField)
      throw new Error(`multiple_linked_records field not found for table ${field.table}`)
    const recordDto = { ...linkedRecordDefaultValues } as RecordData
    if (linkedField.type === 'multiple_linked_records') {
      recordDto[linkedField.name] = [String(currentRecord.fields.id)]
    } else if (linkedField.type === 'single_linked_record') {
      recordDto[linkedField.name] = currentRecord.fields.id
    } else {
      throw new Error(`Unknown type ${linkedField.type} in faker generator`)
    }
    const {
      [field.table]: [record],
    } = generateRecordsDto(appDto, field.table, [recordDto])
    records.push({ table: field.table, fields: record })
    return record.id
  } else if (['datetime'].includes(type)) {
    return faker.date.past().toISOString()
  } else if ('single_select' === type) {
    return field.default ?? faker.helpers.arrayElement(field.options)
  }
  throw new Error(`Unknown type ${type} in faker generator`)
}
