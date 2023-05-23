/** This file is only used for testing, not in production */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs-extra'
import { join, basename } from 'path'
import { faker } from '@faker-js/faker'
import AppUtils from './app.utils'
import PathUtils from './path.utils'
import ConfigUtils from './config.utils'

import type { BuildDataOptionsType, BuiltDataType, TestDataType } from '../types/test.type'

class TestUtils {
  public setupAppEnv(dirPath: string, appName?: string): void {
    const name = appName ?? basename(dirPath)
    const packageMatch = dirPath.match(/\/packages\/([^/]+)/)
    const packageName = packageMatch && packageMatch[1]
    const testFolder = dirPath.includes('/e2e') ? 'e2e' : '__tests__/integration/' + name
    process.env.FDT_APP_NAME = name.replace(/-/g, '_')
    process.env.FDT_ROOT_PATH = `packages/${packageName}/${testFolder}/app`
  }

  public async updateLibraries(packages: string[]): Promise<void> {
    for (const packageName of packages) {
      const path = AppUtils.getPackagePathFile(packageName)
      const libraries = await import(path)
      AppUtils.register({ [AppUtils.getName()]: libraries }, packageName)
    }
  }

  public beforeAll(): void {
    ConfigUtils.init()
  }

  public afterAll(packages: string[] = []): void {
    if (packages.length > 0) for (const packageName of packages) AppUtils.register({}, packageName)
    const path = PathUtils.getAppRoot()
    fs.removeSync(join(path, 'data'))
    fs.removeSync(join(path, 'js'))
    AppUtils.removeAllImports()
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
