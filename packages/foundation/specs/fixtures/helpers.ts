import net from 'net'
import { fakerFR as faker } from '@faker-js/faker'
import { TableDto } from '@application/dtos/TableDto'
import { FieldDto } from '@application/dtos/FieldDto'
import { RecordToCreateDto } from '@application/dtos/RecordDto'
import { TABLE_INVOICES, TABLE_INVOICES_ITEMS, PAGE_LIST_INVOICES } from './schemas'
import { PageDto } from '@application/dtos/PageDto'

export async function findAvailablePort(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address() as net.AddressInfo
      server.close(() => {
        resolve(port)
      })
    })
  })
}

export function getTables(...args: string[]): TableDto[] {
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

export function getPages(...args: string[]): PageDto[] {
  const pages: PageDto[] = []
  for (const pageName of args) {
    switch (pageName) {
      case 'invoices_list':
        pages.push(PAGE_LIST_INVOICES)
        break
      case 'invoices_create':
        pages.push(PAGE_LIST_INVOICES)
        break
      default:
        throw new Error(`Page ${pageName} not found in schemas`)
    }
  }
  return pages
}

export function generateRecord(tableName: string, data: RecordToCreateDto = {}): RecordToCreateDto {
  return { ...generateFakeRecord(tableName), ...data }
}

export function generateManyRecords(
  tableName: string,
  countOrRecords: number | RecordToCreateDto[]
): RecordToCreateDto[] {
  const array = []
  if (Array.isArray(countOrRecords)) {
    const records: RecordToCreateDto[] = countOrRecords
    for (const record of records) {
      const newRecord = generateFakeRecord(tableName)
      array.push({ ...newRecord, ...record })
    }
  } else {
    const count: number = countOrRecords
    for (let i = 0; i < count; i++) {
      const record = generateFakeRecord(tableName)
      array.push(record)
    }
  }
  return array
}

export function generateFakeRecord(tableName: string): RecordToCreateDto {
  const tables = getTables(tableName)
  const table = tables.find((table) => table.name === tableName)
  if (!table) throw new Error(`Table ${tableName} not found`)
  const recordToCreate: RecordToCreateDto = {}
  for (const field of table.fields) {
    if (!field.optional || (field.optional && Math.random() > 0.5)) {
      const value = generateRandomValueByType(field)
      if (value !== null) {
        if (typeof value === 'object') {
          if (field.type === 'multiple_linked_records' && Array.isArray(value)) {
            recordToCreate[field.name] = {
              create: value,
            }
          }
          if (field.type === 'single_linked_record' && !Array.isArray(value)) {
            recordToCreate[field.name] = {
              create: value,
            }
          }
        } else {
          recordToCreate[field.name] = value
        }
      }
    }
  }
  return recordToCreate
}

export function generateRandomValueByType(
  field: FieldDto
): string | number | boolean | RecordToCreateDto | RecordToCreateDto[] | null {
  const { type, name } = field
  switch (type) {
    case 'single_line_text':
    case 'long_text':
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
    case 'number':
      if (name.includes('quantity')) return faker.number.int(50)
      return faker.number.int(1000)
    case 'currency':
      if (name.includes('price')) return faker.number.float({ max: 1000, precision: 0.01 })
      return faker.number.float({ precision: 0.01 })
    case 'multiple_linked_records':
      return []
    case 'single_linked_record':
      return []
    case 'formula':
      return null
    case 'rollup':
      return null
    default:
      throw new Error(`Unknown type ${type} in faker generator`)
  }
}
