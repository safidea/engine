/** This file is only used for testing, not in production */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { faker } from '@faker-js/faker'
import ConfigUtils from './config.utils'

import type { BuildDataOptionsType, BuiltDataType, TestDataType } from '../types/test.type'

class TestUtils {
  public setupAppEnv(): void {}

  public beforeAll(): void {
    ConfigUtils.init()
  }

  private buildData(table: string, options?: BuildDataOptionsType): BuiltDataType {
    const { initData = {}, isValid = true } = options || {}
    const data = { ...initData }
    const { fields } = ConfigUtils.get(`tables.${table}`) as any
    for (const field of Object.keys(fields)) {
      const { optional, default: defaultValue, type } = fields[field as keyof typeof fields] as any
      if (!optional && !defaultValue) {
        if (type === 'String') {
          data[field] = isValid
            ? faker.helpers.unique(faker.name.jobDescriptor)
            : faker.helpers.unique(faker.datatype.number)
        }
        if (type === 'Int') {
          data[field] = isValid
            ? faker.helpers.unique(faker.datatype.number)
            : faker.helpers.unique(faker.word.noun)
        }
        if (type === 'DateTime') {
          data[field] = isValid
            ? faker.date.past().toISOString()
            : faker.helpers.unique(faker.name.jobDescriptor)
        }
        if (type === 'Boolean') {
          data[field] = isValid
            ? faker.datatype.boolean()
            : faker.helpers.unique(faker.datatype.string)
        }
      }
    }
    return { data, fields }
  }

  public getTableErrors(fields: { [key: string]: any }, fieldRequired?: string): string[] {
    return Object.keys(fields)
      .map((field) => {
        if (field === fieldRequired) return `Field ${field} is required`
        if (fields[field].default || fields[field].optional) return ''
        if (fields[field].type === 'Int') return `Field ${field} must be an integer`
        if (fields[field].type === 'DateTime') return `Field ${field} must be a valid date`
        return `Field ${field} must be a ${fields[field].type.toLowerCase()}`
      })
      .filter((error) => error !== '')
  }

  public createValidData(table: string): BuiltDataType {
    return this.buildData(table)
  }

  public createInvalidData(table: string): BuiltDataType {
    return this.buildData(table, { isValid: false })
  }

  public updateValidData(table: string, data: TestDataType): BuiltDataType {
    return this.buildData(table, { initData: data })
  }

  public updateInvalidData(table: string, data: TestDataType): BuiltDataType {
    return this.buildData(table, { initData: data, isValid: false })
  }
}

export default new TestUtils()
