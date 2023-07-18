import { TableDto } from '@application/dtos/TableDto'
import { fakerFR as faker } from '@faker-js/faker'
import { FieldDto } from '@application/dtos/FieldDto'
import { DataDto } from '@application/dtos/DataDto'

type SelectTable = 'invoices'
export class Helpers {
  public getTableSchema(tableName: SelectTable): TableDto[] {
    switch (tableName) {
      case 'invoices':
        return [
          {
            name: 'invoices',
            fields: [
              {
                name: 'customer',
                type: 'single_line_text',
              },
              {
                name: 'address',
                type: 'single_line_text',
              },
              {
                name: 'zip_code',
                type: 'single_line_text',
              },
              {
                name: 'country',
                type: 'single_line_text',
              },
              {
                name: 'items',
                type: 'multiple_linked_records',
                table: 'invoices_items',
              },
              {
                name: 'total_net_amount',
                type: 'rollup',
                linked_records: 'items',
                linked_field: 'total_net_amount',
                formula: 'sum(values)',
                format: 'currency',
              },
              {
                name: 'total_vat',
                type: 'rollup',
                linked_records: 'items',
                linked_field: 'total_vat',
                formula: 'sum(values)',
                format: 'currency',
              },
              {
                name: 'total_amount',
                type: 'rollup',
                linked_records: 'items',
                linked_field: 'total_amount',
                formula: 'sum(values)',
                format: 'currency',
              },
            ],
          },
          {
            name: 'invoices_items',
            fields: [
              { name: 'invoice', type: 'single_linked_record', table: 'invoices' },
              { name: 'name', type: 'single_line_text' },
              { name: 'description', type: 'long_text', optional: true },
              { name: 'quantity', type: 'number' },
              { name: 'unity', type: 'single_line_text' },
              { name: 'unit_price', type: 'currency' },
              { name: 'vat', type: 'number' },
              {
                name: 'total_net_amount',
                type: 'formula',
                formula: 'quantity * unit_price',
                format: 'currency',
              },
              {
                name: 'total_vat',
                type: 'formula',
                formula: 'total_net_amount * vat',
                format: 'currency',
              },
              {
                name: 'total_amount',
                type: 'formula',
                formula: 'total_net_amount + total_vat',
                format: 'currency',
              },
            ],
          },
        ]
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
        data[field.name] = this.generateRandomValueByType(field)
      }
    }
    return data
  }

  private generateRandomValueByType(
    field: FieldDto
  ): string | number | boolean | DataDto | DataDto[] {
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
        return []
      case 'single_linked_record':
        return {}
      case 'formula':
        return 0
      case 'rollup':
        return 0
      default:
        throw new Error(`Unknown type ${type} in faker generator`)
    }
  }
}
