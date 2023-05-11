process.env.APP_NAME = 'base'
import PrismaLib from '@database/server/lib/prisma.lib'
import PrismaUtils from '@database/server/utils/prisma.utils'

jest.mock('@database/server/utils/prisma.utils')
jest.mock('@common/server/apps')

beforeAll(async () => {
  jest.clearAllMocks()
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
