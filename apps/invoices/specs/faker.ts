import { fakerFR as faker } from '@faker-js/faker'
import fs from 'fs-extra'

const config = fs.readJSONSync(`./config.json`)

type PropsType = {
  field: string
  type: string
  options: string[]
}

function generateRandomValueByType({ field, type, options }: PropsType) {
  switch (type) {
    case 'String':
      if (field.includes('email')) return faker.internet.email()
      if (field.includes('phone')) return faker.phone.number()
      if (field.includes('address')) return faker.location.streetAddress()
      if (field.includes('city')) return faker.location.city()
      if (field.includes('state')) return faker.location.state()
      if (field.includes('zip')) return faker.location.zipCode()
      if (field.includes('country')) return faker.location.country()
      if (field.includes('firstName')) return faker.person.firstName()
      if (field.includes('lastName')) return faker.person.lastName()
      if (field.includes('fullname')) return faker.person.fullName()
      if (field.includes('company') || field.includes('organization') || field.includes('customer'))
        return faker.company.name()
      if (field.includes('domain')) return faker.internet.domainName()
      if (field.includes('title')) return faker.person.jobTitle()
      if (field.includes('description')) return faker.lorem.paragraph()
      if (field.includes('url')) return faker.internet.url()
      if (field.includes('image')) return faker.image.url()
      if (field.includes('color')) return faker.internet.color()
      if (field.includes('username')) return faker.internet.userName()
      if (field.includes('password')) return faker.internet.password()
      if (field.includes('text')) return faker.lorem.text()
      if (field.includes('unit')) return faker.commerce.productName()
      if (field.includes('number')) return String(faker.number.int(1000))
      return faker.word.words()
    case 'Int':
      if (field.includes('quantity')) return faker.number.int(50)
      return faker.number.int(1000)
    case 'Decimal':
      if (field.includes('price')) return faker.number.float({ max: 1000, precision: 0.01 })
      return faker.number.float({ precision: 0.01 })
    case 'SingleSelect':
      return options[Math.floor(Math.random() * options.length)]
    case 'DateTime':
      return faker.date.recent().toISOString()
    case 'Formula':
      return faker.word.words()
    default:
      throw new Error(`Unknown type ${type} in faker generator`)
  }
}

function generateFakeRecord(table: string) {
  const tableConfig = config.tables[table]
  const record = {}
  for (const field in tableConfig.fields) {
    const fieldConfig = tableConfig.fields[field]
    if (!fieldConfig.optional || (fieldConfig.optional && Math.random() > 0.5)) {
      const { type, options } = fieldConfig
      record[field] = generateRandomValueByType({ field, type, options })
    }
  }
  return record
}

function generateDynamicFakeData(table: string, count?: number | any[]) {
  if (!count) return generateFakeRecord(table)
  const data = []
  if (Array.isArray(count)) {
    for (const record of count) {
      const newRecord = generateFakeRecord(table)
      data.push({ ...newRecord, ...record })
    }
  } else {
    for (let i = 0; i < count; i++) {
      const record = generateFakeRecord(table)
      data.push(record)
    }
  }
  return data
}

const extendsFaker = { ...faker, generate: generateDynamicFakeData }

export default extendsFaker
