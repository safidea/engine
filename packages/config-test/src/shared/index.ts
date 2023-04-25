import { faker } from '@faker-js/faker'
import config from './config.json'

export type TestData = {
  [key: string]: string | number | boolean
}

export type BuiltData = {
  data: TestData
  fields: {
    [key: string]: {
      type: string
      optional: boolean
      default: string | number | boolean
    }
  }
}

function buildData(tableName: string, data: TestData = {}, valid = true): BuiltData {
  const table = config.tables[tableName as keyof typeof config.tables] as any
  const { fields } = table
  for (const field of Object.keys(fields)) {
    const { optional, default: defaultValue, type } = fields[field as keyof typeof fields] as any
    if (!optional && !defaultValue) {
      if (type === 'String') {
        data[field] = valid
          ? faker.helpers.unique(faker.name.jobDescriptor)
          : faker.datatype.number()
      }
      if (type === 'Int') {
        data[field] = valid
          ? faker.helpers.unique(faker.datatype.number)
          : faker.name.jobDescriptor()
      }
      if (type === 'DateTime') {
        data[field] = valid ? (faker.date.past() as unknown as string) : faker.datatype.string()
      }
      if (type === 'Boolean') {
        data[field] = valid ? faker.datatype.boolean() : faker.datatype.string()
      }
    }
  }
  return { data, fields }
}

export function createData(table: string, valid = true): BuiltData {
  return buildData(table, {}, valid)
}

export function updateData(table: string, data: TestData, valid = true): BuiltData {
  return buildData(table, data, valid)
}

export function response() {
  return {
    status: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn(),
  }
}
