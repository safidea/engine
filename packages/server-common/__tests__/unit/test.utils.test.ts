import './setup'
import { PathUtils, ConfigUtils } from '../../src'
import TestUtils from '../../src/utils/test.utils'
import fs from 'fs-extra'
import { join } from 'path'

import type { TestDataType } from '../../src/types/test.type'

jest.mock('../../src/utils/app.utils')
jest.mock('../../src/utils/path.utils')
jest.mock('../../src/utils/config.utils')

describe('beforeAll', () => {
  it('should call ConfigUtils.init', () => {
    TestUtils.beforeAll()
    expect(ConfigUtils.init).toHaveBeenCalled()
  })
})

describe('afterAll', () => {
  it('should remove packages directory', () => {
    const path = 'testPath'
    const getAppRoot = PathUtils.getAppRoot as jest.MockedFunction<typeof PathUtils.getAppRoot>
    getAppRoot.mockReturnValue(path)
    TestUtils.afterAll()
    expect(fs.removeSync).toHaveBeenCalledWith(join(path, 'build'))
  })

  it('should remove data and js directories with packages', () => {
    const path = 'testPath'
    const getAppRoot = PathUtils.getAppRoot as jest.MockedFunction<typeof PathUtils.getAppRoot>
    getAppRoot.mockReturnValue(path)
    TestUtils.afterAll(['package1'])
  })
})

describe('buildData', () => {
  it('should build valid data', () => {
    const table = 'testTable'
    const fields = {
      name: { type: 'String', optional: false },
      age: { type: 'Int', optional: false },
      joinedDate: { type: 'DateTime', optional: false },
      isActive: { type: 'Boolean', optional: false },
    }
    const get = ConfigUtils.get as jest.MockedFunction<typeof ConfigUtils.get>
    get.mockReturnValue({ fields })

    const result = TestUtils.createValidData(table)
    expect(result.data).toBeDefined()
    expect(result.fields).toEqual(fields)
  })

  it('should build invalid data', () => {
    const table = 'testTable'
    const fields = {
      name: { type: 'String', optional: false },
      age: { type: 'Int', optional: false },
      joinedDate: { type: 'DateTime', optional: false },
      isActive: { type: 'Boolean', optional: false },
    }
    const get = ConfigUtils.get as jest.MockedFunction<typeof ConfigUtils.get>
    get.mockReturnValue({ fields })

    const result = TestUtils.createInvalidData(table)
    expect(result.data).toBeDefined()
    expect(result.fields).toEqual(fields)
  })
})

describe('getTableErrors', () => {
  it('should return table errors', () => {
    const fields = {
      id: { type: 'String', optional: false },
      name: { type: 'String', optional: false },
      age: { type: 'Int', optional: false },
      joinedDate: { type: 'DateTime', optional: false },
      isActive: { type: 'Boolean', optional: false },
      email: { type: 'String', optional: true },
      password: { type: 'String', default: '123' },
    }

    const errors = TestUtils.getTableErrors(fields, 'id')
    expect(errors).toEqual([
      'Field id is required',
      'Field name must be a string',
      'Field age must be an integer',
      'Field joinedDate must be a valid date',
      'Field isActive must be a boolean',
    ])
  })
})

describe('updateValidData', () => {
  it('should update data with valid values', () => {
    const table = 'testTable'
    const data: TestDataType = {
      name: 'Test',
      age: 30,
      joinedDate: new Date().toISOString(),
      isActive: true,
    }
    const fields = {
      name: { type: 'String', optional: false },
      age: { type: 'Int', optional: false },
      joinedDate: { type: 'DateTime', optional: false },
      isActive: { type: 'Boolean', optional: false },
    }
    const get = ConfigUtils.get as jest.MockedFunction<typeof ConfigUtils.get>
    get.mockReturnValue({ fields })

    const result = TestUtils.updateValidData(table, data)
    expect(result.data).toBeDefined()
    expect(result.fields).toEqual(fields)
  })
})

describe('updateInvalidData', () => {
  it('should update data with invalid values', () => {
    const table = 'testTable'
    const data: TestDataType = {
      name: 'Test',
      age: 30,
      joinedDate: new Date().toISOString(),
      isActive: true,
    }
    const fields = {
      name: { type: 'String', optional: false },
      age: { type: 'Int', optional: false },
      joinedDate: { type: 'DateTime', optional: false },
      isActive: { type: 'Boolean', optional: false },
    }
    const get = ConfigUtils.get as jest.MockedFunction<typeof ConfigUtils.get>
    get.mockReturnValue({ fields })

    const result = TestUtils.updateInvalidData(table, data)
    expect(result.data).toBeDefined()
    expect(result.fields).toEqual(fields)
  })
})