import './setup'
import PrismaLibrary from '../../src/libraries/prisma.library'

beforeAll(() => {
  PrismaLibrary.init()
})

describe('base', () => {
  it('should return a base', () => {
    const result = PrismaLibrary.base('master')
    expect(result).toBeDefined()
  })

  it('should return undefined if base does not exist', () => {
    const result = PrismaLibrary.base('test')
    expect(result).toBeUndefined()
  })
})

describe('table', () => {
  it('should return a table', () => {
    const result = PrismaLibrary.table('master', 'users')
    expect(result).toBeDefined()
  })

  it('should return undefined if table does not exist', () => {
    const result = PrismaLibrary.table('master', 'tests')
    expect(result).toBeUndefined()
  })

  it('should return undefined if base does not exist', () => {
    const result = PrismaLibrary.table('main', 'tests')
    expect(result).toBeUndefined()
  })
})
