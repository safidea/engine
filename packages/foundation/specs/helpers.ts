import { TableDto } from '@application/dtos/TableDto'
import { fakerFR as faker } from '@faker-js/faker'
import { FieldDto } from '@application/dtos/FieldDto'
import { DataDto } from '@application/dtos/DataDto'
import { TABLE_INVOICES, TABLE_INVOICES_ITEMS } from './schema'

type SelectTable = 'invoices' | 'invoices_items'
export class Helpers {
  public getTableSchema(tableName: SelectTable): TableDto[] {
    switch (tableName) {
      case 'invoices':
        return [TABLE_INVOICES, TABLE_INVOICES_ITEMS]
      case 'invoices_items':
        return [TABLE_INVOICES_ITEMS]
      default:
        throw new Error(`Table schema ${tableName} from helper not found`)
    }
  }

  public generateTableData(tableName: SelectTable, data: DataDto = {}): DataDto {
    return { ...this.generateFakeData(tableName), ...data }
  }

  public generateArrayTableData(
    tableName: SelectTable,
    countOrDatas: number | DataDto[]
  ): DataDto | DataDto[] {
    const array = []
    if (Array.isArray(countOrDatas)) {
      const datas: DataDto[] = countOrDatas
      for (const data of datas) {
        const newData = this.generateFakeData(tableName)
        array.push({ ...newData, ...data })
      }
    } else {
      const count: number = countOrDatas
      for (let i = 0; i < count; i++) {
        const data = this.generateFakeData(tableName)
        array.push(data)
      }
    }
    return array
  }

  private generateFakeData(tableName: SelectTable): DataDto {
    const tables = this.getTableSchema(tableName)
    const table = tables.find((table) => table.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    const data: DataDto = {}
    for (const field of table.fields) {
      if (!field.optional || (field.optional && Math.random() > 0.5)) {
        const value = this.generateRandomValueByType(field)
        if (value !== null) data[field.name] = value
      }
    }
    return data
  }

  private generateRandomValueByType(
    field: FieldDto
  ): string | number | boolean | DataDto | DataDto[] | null {
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
      case 'date':
        return faker.date.recent().toISOString()
      case 'multiple_linked_records':
        return null
      case 'single_linked_record':
        return null
      case 'formula':
        return null
      case 'rollup':
        return null
      default:
        throw new Error(`Unknown type ${type} in faker generator`)
    }
  }
}
