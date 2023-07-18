import { TableDto } from '@application/dtos/TableDto'
import { fakerFR as faker } from '@faker-js/faker'
import { FieldDto } from '@application/dtos/FieldDto'
import { DataDto } from '@application/dtos/DataDto'

export class Helpers {
  public getTableSchema(table: string): TableDto {
    switch (table) {
      case 'invoices':
        return {
          name: 'invoices',
          fields: [
            {
              name: 'customer',
              type: 'String',
              required: true,
            },
            {
              name: 'address',
              type: 'String',
              required: true,
            },
            {
              name: 'zip_code',
              type: 'String',
              required: true,
            },
            {
              name: 'country',
              type: 'String',
              required: true,
            },
          ],
        }
      default:
        throw new Error(`Table schema ${table} from helper not found`)
    }
  }

  public generateTableRecords(table: string, count: number | DataDto[]) {
    let data
    if (!count) {
      data = this.generateFakeRecord(table)
    } else {
      data = []
      if (Array.isArray(count)) {
        for (const record of count) {
          const newRecord = this.generateFakeRecord(table)
          data.push({ ...newRecord, ...record })
        }
      } else {
        for (let i = 0; i < count; i++) {
          const record = this.generateFakeRecord(table)
          data.push(record)
        }
      }
    }
    switch (table) {
      case 'invoices':
        if (Array.isArray(data)) return data
        return data
      default:
        return data
    }
  }

  private generateRandomValueByType(field: FieldDto): string | number | boolean {
    const { type, name } = field
    switch (type) {
      case 'String':
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
      case 'Int':
        if (name.includes('quantity')) return faker.number.int(50)
        return faker.number.int(1000)
      case 'Decimal':
        if (name.includes('price')) return faker.number.float({ max: 1000, precision: 0.01 })
        return faker.number.float({ precision: 0.01 })
      case 'DateTime':
        return faker.date.recent().toISOString()
      default:
        throw new Error(`Unknown type ${type} in faker generator`)
    }
  }

  private generateFakeRecord(table: string): DataDto {
    const tableConfig = this.getTableSchema(table)
    const record: DataDto = {}
    for (const field of tableConfig.fields) {
      if (field.required || (!field.required && Math.random() > 0.5)) {
        record[field.name] = this.generateRandomValueByType(field)
      }
    }
    return record
  }
}
