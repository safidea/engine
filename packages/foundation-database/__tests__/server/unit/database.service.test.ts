import DatabaseService from '@database/server/services/database.service'
import PrismaLib from '@database/server/lib/prisma.lib'

jest.mock('@database/server/lib/prisma.lib')

beforeAll(() => {
  jest.clearAllMocks()
})

describe('baseExist', () => {
  it('should return true', () => {
    const result = DatabaseService.baseExist('master')
    expect(result).toEqual(true)
  })

  it('should return false', () => {
    const base = PrismaLib.base as jest.MockedFunction<typeof PrismaLib.base>
    base.mockReturnValueOnce(undefined)
    const result = DatabaseService.baseExist('test')
    expect(result).toEqual(false)
  })
})

describe('tableExist', () => {
  it('should return true', () => {
    const result = DatabaseService.tableExist('master', 'User')
    expect(result).toEqual(true)
  })

  it('should return false', () => {
    const table = PrismaLib.table as jest.MockedFunction<typeof PrismaLib.table>
    table.mockReturnValueOnce(undefined)
    const result = DatabaseService.tableExist('master', 'User')
    expect(result).toEqual(false)
  })
})

describe('create', () => {
  it('should return a row', async () => {
    const result = await DatabaseService.create('master', 'User', {
      data: {
        name: 'test',
      },
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })

  it('should throw an error', async () => {
    const table = PrismaLib.table as jest.MockedFunction<typeof PrismaLib.table>
    table.mockReturnValueOnce(undefined)
    try {
      await DatabaseService.create('master', 'User', {
        data: {
          name: 'test',
        },
      })
    } catch (e: any) {
      expect(e.message).toEqual('Table "User" does not exist in base "master"')
    }
  })
})

describe('updateById', () => {
  it('should return a row', async () => {
    const result = await DatabaseService.updateById('master', 'User', {
      id: '1',
      data: {
        name: 'test',
      },
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('upsertById', () => {
  it('should return a row', async () => {
    const result = await DatabaseService.upsertById('master', 'User', {
      id: '1',
      data: {
        name: 'test',
      },
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('readById', () => {
  it('should return a row', async () => {
    const result = await DatabaseService.readById('master', 'User', {
      id: '1',
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('deleteById', () => {
  it('should return a row', async () => {
    const result = await DatabaseService.deleteById('master', 'User', {
      id: '1',
    })
    expect(result).toEqual({ id: '1', name: 'test' })
  })
})

describe('list', () => {
  it('should return a list of rows', async () => {
    const result = await DatabaseService.list('master', 'User')
    expect(result).toEqual([
      { id: '1', name: 'test' },
      { id: '2', name: 'test' },
    ])
  })
})
