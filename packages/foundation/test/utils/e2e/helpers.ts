import { fakerFR as faker } from '@faker-js/faker'
import { v4 as uuidV4 } from 'uuid'
import fs from 'fs-extra'
import { PageDto } from '@adapter/api/page/dtos/PageDto'
import { TableDto } from '@adapter/api/table/dtos/TableDto'
import { RecordDto } from '@adapter/spi/orm/dtos/RecordDto'
import { FieldDto } from '@adapter/api/table/dtos/FieldDto'
import { IOrmAdapter } from '@adapter/spi/orm/IOrmAdapter'
import {
  TABLE_INVOICES,
  TABLE_INVOICES_ITEMS,
  PAGE_LIST_INVOICES,
  PAGE_CREATE_INVOICE,
  PAGE_UPDATE_INVOICE,
  AUTOMATION_CREATED_INVOICE_WITH_HTML_TEMPLATE,
  AUTOMATION_CREATED_INVOICE_WITH_HTML_FILE_TEMPLATE,
} from './schemas/invoices'
import { RecordFieldValue } from '@domain/entities/orm/Record/IRecord'
import { AutomationDto } from '@adapter/api/automation/dtos/AutomationDto'

export function getUrl(port: number, path: string): string {
  return `http://localhost:${port}${path}`
}

export function getTablesDto(...args: string[]): TableDto[] {
  const tables: TableDto[] = []
  for (const tableName of args) {
    switch (tableName) {
      case 'invoices':
        tables.push(TABLE_INVOICES, TABLE_INVOICES_ITEMS)
        break
      case 'invoices_items':
        tables.push(TABLE_INVOICES_ITEMS)
        break
      default:
        throw new Error(`Table ${tableName} not found in schemas`)
    }
  }
  return tables
}

export function getPagesDto(...args: string[]): PageDto[] {
  const pages: PageDto[] = []
  for (const pageName of args) {
    switch (pageName) {
      case 'invoices_list':
        pages.push(PAGE_LIST_INVOICES)
        break
      case 'invoices_create':
        pages.push(PAGE_CREATE_INVOICE)
        break
      case 'invoices_update':
        pages.push(PAGE_UPDATE_INVOICE)
        break
      default:
        throw new Error(`Page ${pageName} not found in schemas`)
    }
  }
  return pages
}

export function getAutomationsDto(...args: string[]): AutomationDto[] {
  const automations: AutomationDto[] = []
  for (const automationName of args) {
    switch (automationName) {
      case 'created_invoice_with_html_template':
        automations.push(AUTOMATION_CREATED_INVOICE_WITH_HTML_TEMPLATE)
        break
      case 'created_invoice_with_html_file_template':
        automations.push(AUTOMATION_CREATED_INVOICE_WITH_HTML_FILE_TEMPLATE)
        break
      default:
        throw new Error(`Automation ${automationName} not found in schemas`)
    }
  }
  return automations
}

export function copyPrivateTemplate(templateName: string, folder: string): void {
  const templatePath = `${__dirname}/templates/${templateName}`
  const destinationPath = `${folder}/private/templates/${templateName}`
  fs.ensureDirSync(`${folder}/private/templates`)
  fs.copyFileSync(templatePath, destinationPath)
}

export function getTableByName(tableName: string): TableDto {
  const tablesDto = getTablesDto(tableName)
  const tableDto = tablesDto.find((tableDto) => tableDto.name === tableName)
  if (!tableDto) throw new Error(`Table ${tableName} not found`)
  return tableDto
}

export interface RecordDtoTable {
  table: string
  fields: RecordDto
}
export interface RecordsDtoByTables {
  [key: string]: RecordDto[]
}

export type ExtendRecordFieldValue = RecordFieldValue | RecordDto | RecordDto[]

export interface ExtendRecordDto {
  [key: string]: ExtendRecordFieldValue
}

export async function generateRecords(
  ormAdapter: IOrmAdapter,
  tableName: string,
  countOrRecordsDto: number | ExtendRecordDto[] = 1
): Promise<RecordsDtoByTables> {
  const tables = generateRecordsDto(tableName, countOrRecordsDto)
  for (const table in tables) {
    await ormAdapter.createMany(table, tables[table])
  }
  return tables
}

export function generateRecordsDto(
  tableName: string,
  countOrRecordsDto: number | ExtendRecordDto[] = 1
): RecordsDtoByTables {
  const tableDto = getTableByName(tableName)
  const records: RecordDtoTable[] = []
  const length =
    typeof countOrRecordsDto === 'number' ? countOrRecordsDto : countOrRecordsDto.length
  for (let i = 0; i < length; i++) {
    const defaultValues: ExtendRecordDto =
      typeof countOrRecordsDto !== 'number' ? countOrRecordsDto[i] : {}
    const record: RecordDtoTable = {
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
          (field.name in defaultValues && defaultValue === undefined)
        )
          continue
        record.fields[field.name] = generateRandomValueByField(field, records, record, defaultValue)
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
  field: FieldDto,
  records: RecordDtoTable[],
  currentRecord: RecordDtoTable,
  defaultValue: ExtendRecordFieldValue
): RecordFieldValue {
  const { type, name } = field
  if (defaultValue && typeof defaultValue !== 'object') {
    return defaultValue
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
  } else if (['number'].includes(type)) {
    if (name.includes('quantity')) return faker.number.int(50)
    return faker.number.int(1000)
  } else if (['currency'].includes(type)) {
    if (name.includes('price')) return faker.number.float({ max: 1000, precision: 0.01 })
    return faker.number.float({ precision: 0.01 })
  } else if (type === 'multiple_linked_records') {
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
          `multiple_linked_records field ${field.name} must have an array of RecordDto as default value`
        )
      }
    }
    if (linkedRecords.length > 0) return linkedRecords
    const linkedTable = getTableByName(field.table)
    const linkedField = linkedTable.fields.find((f) => f.type === 'single_linked_record')
    if (!linkedField)
      throw new Error(`single_linked_record field not found for table ${field.table}`)
    const { [field.table]: newRecords } = generateRecordsDto(
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
    const linkedField = linkedTable.fields.find((f) => f.type === 'multiple_linked_records')
    if (!linkedField)
      throw new Error(`multiple_linked_records field not found for table ${field.table}`)
    const {
      [field.table]: [record],
    } = generateRecordsDto(field.table, [
      { [linkedField.name]: currentRecord.fields.id, ...linkedRecordDefaultValues },
    ])
    records.push({ table: field.table, fields: record })
    return record.id
  } else if (['datetime'].includes(type)) {
    return faker.date.past().toISOString()
  } else if ('single_select' === type) {
    return field.default ?? faker.helpers.arrayElement(field.options)
  } else if ('autonumber' === type) {
    return faker.number.int(10)
  }
  throw new Error(`Unknown type ${type} in faker generator`)
}
