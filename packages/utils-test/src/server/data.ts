import { TestUtils } from '@test/server'
import { faker } from '@faker-js/faker'

export type TestDataInterface = {
  [key: string]: string | number | boolean
}

export type BuiltDataInterface = {
  data: TestDataInterface
  fields: {
    [key: string]: {
      type: string
      optional: boolean
      default: string | number | boolean
    }
  }
}

class TestData {
  private table: any

  constructor({ appIdName, tableName }: { appIdName: string; tableName: string }) {
    const config = TestUtils.getConfig(appIdName)
    this.table = config.tables[tableName as keyof typeof config.tables] as any
  }

  private build(data: TestDataInterface = {}, valid = true): BuiltDataInterface {
    const { fields } = this.table
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

  public createValid(): BuiltDataInterface {
    return this.build()
  }

  public createInvalid(): BuiltDataInterface {
    return this.build({}, false)
  }

  public updateValid(data: TestDataInterface): BuiltDataInterface {
    return this.build(data)
  }

  public updateInvalid(data: TestDataInterface): BuiltDataInterface {
    return this.build(data, false)
  }
}

export default TestData
