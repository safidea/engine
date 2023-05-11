process.env.APP_NAME = 'base'
import fs from 'fs-extra'
import cp from 'child_process'
import PrismaUtils from '@database/server/utils/prisma.utils'
import AppUtils from '@common/server/utils/app.utils'

import type { DatabaseInterface, PrismaModelInterface } from '@database'

jest.mock('fs-extra')
jest.mock('child_process')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getModelName', () => {
  it('should return model name', () => {
    const result = PrismaUtils.getModelName('users')
    expect(result).toEqual('User')
  })
})

describe('getSchemaPath', () => {
  it('should return schema path if file exist', () => {
    const result = PrismaUtils.getSchemaPath('master')
    expect(result.endsWith('prisma/master/schema.prisma')).toBe(true)
  })

  it('should create schema file if file does not exist', () => {
    const existsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>
    existsSync.mockReturnValueOnce(false)
    PrismaUtils.getSchemaPath('master')
    expect(fs.ensureFileSync).toBeCalledTimes(1)
    expect(fs.writeFileSync).toBeCalledTimes(1)
  })
})

describe('updateDatabaseSchema', () => {
  const config: DatabaseInterface = {
    provider: 'postgresql',
    url: 'postgres://localhost:5432/test',
  }

  it('should update empty database schema', async () => {
    PrismaUtils.updateDatabaseSchema('master', config)
    expect(fs.writeFileSync).toBeCalledTimes(0)
    expect(fs.appendFileSync).toBeCalledTimes(1)
  })

  it('should update existing database schema', async () => {
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce('datasource db { }')
    PrismaUtils.updateDatabaseSchema('master', config)
    expect(fs.writeFileSync).toBeCalledTimes(1)
    expect(fs.appendFileSync).toBeCalledTimes(0)
  })
})

describe('updateModelSchema', () => {
  const modelData: PrismaModelInterface = {
    fields: {
      id: {
        type: 'String',
        primary: true,
        optional: false,
        unique: true,
        default: 'uuid()',
      },
      name: {
        type: 'String',
        primary: false,
        optional: true,
        unique: false,
        list: true,
        relation: {
          fields: ['id'],
          references: ['User'],
          onDelete: 'CASCADE',
        },
      },
    },
    unique: ['name'],
    map: 'users',
  }

  it('should update empty model schema', async () => {
    PrismaUtils.updateModelSchema('master', 'User', modelData)
    expect(fs.writeFileSync).toBeCalledTimes(0)
    expect(fs.appendFileSync).toBeCalledTimes(1)
  })

  it('should update existing model schema', async () => {
    delete modelData.map
    delete modelData.unique
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce('model User { }')
    PrismaUtils.updateModelSchema('master', 'User', modelData)
    expect(fs.writeFileSync).toBeCalledTimes(1)
    expect(fs.appendFileSync).toBeCalledTimes(0)
  })
})

describe('buildClient', () => {
  it('should not build client if is ready', async () => {
    PrismaUtils.buildClient('master')
    expect(cp.execSync).toBeCalledTimes(0)
  })

  it('should build client if is not ready', async () => {
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce('test')
    PrismaUtils.buildClient('master')
    expect(cp.execSync).toBeCalledTimes(3)
  })

  it('should not reset database if NODE_ENV is not test', async () => {
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce('test')
    process.env.NODE_ENV = 'production'
    PrismaUtils.buildClient('master')
    expect(cp.execSync).toBeCalledTimes(3)
    process.env.NODE_ENV = 'test'
  })
})

describe('importClients', () => {
  it('should build index clients', async () => {
    jest.spyOn(AppUtils, 'addImport')
    PrismaUtils.importClients(['master'])
    expect(fs.writeFileSync).toBeCalledTimes(1)
    expect(AppUtils.addImport).toBeCalledTimes(1)
  })
})

describe('getClientFolder', () => {
  it('should return client folder', async () => {
    const result = PrismaUtils.getClientFolder()
    expect(result.endsWith('prisma')).toBe(true)
  })
})
