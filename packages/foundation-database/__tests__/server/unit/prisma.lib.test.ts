import { join } from 'path'
import PrismaLib from '@database/server/lib/prisma.lib'
import PrismaUtils from '@database/server/utils/prisma.utils'

jest.mock('@database/server/utils/prisma.utils')

beforeAll(async () => {
  jest.clearAllMocks()
  await PrismaLib.init(join(__dirname, '../prisma.clients'))
})

describe('base', () => {
  it('should return a base', () => {
    const result = PrismaLib.base('master')
    expect(result).toBeDefined()
  })

  it('should return undefined if base does not exist', () => {
    const result = PrismaLib.base('test')
    expect(result).toBeUndefined()
  })
})

describe('table', () => {
  it('should return a table', () => {
    const result = PrismaLib.table('master', 'users')
    expect(result).toBeDefined()
  })

  it('should return undefined if table does not exist', () => {
    const getModelName = PrismaUtils.getModelName as jest.MockedFunction<
      typeof PrismaUtils.getModelName
    >
    getModelName.mockReturnValueOnce('Test')
    const result = PrismaLib.table('master', 'tests')
    expect(result).toBeUndefined()
  })

  it('should return undefined if base does not exist', () => {
    const result = PrismaLib.table('main', 'tests')
    expect(result).toBeUndefined()
  })
})
