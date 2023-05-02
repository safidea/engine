import fs from 'fs-extra'
import DatabaseUtils from '@database/server/utils/database.utils'

jest.mock('fs-extra')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getDefaults', () => {
  it('should return defaults', () => {
    const result = DatabaseUtils.getDefaults()
    expect(result.master).toBeDefined()
    expect(result.master.url).toEqual(expect.any(String))
    expect(result.master.provider).toEqual(expect.any(String))
    expect(fs.ensureFileSync).toBeCalledTimes(1)
  })
})

describe('buildImport', () => {
  beforeAll(() => {
    process.env.APP_NAME = 'test'
  })

  it('should write import file with import and export', () => {
    const script = `
    /** Start import */
    /** End import */

    /** Start export */
    /** End export */
    `
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce(script)
    DatabaseUtils.buildImport()
    expect(fs.writeFileSync).toBeCalledTimes(1)
  })

  it('should not write import file with existant import and export', () => {
    const script = `
    /** Start import */
    import TestPrismaClients from '/foundation-database/src/server/configs/import.config.ts'
    /** End import */

    /** Start export */
    exportPrismaClients('test', TestPrismaClients)
    /** End export */
    `
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce(script)
    DatabaseUtils.buildImport()
    expect(fs.writeFileSync).toBeCalledTimes(0)
  })
})

describe('cleanImport', () => {
  it('should clean import file', () => {
    const script = `
    /** Start import */
    import TestPrismaClients from '/foundation-database/src/server/configs/import.config.ts'
    /** End import */

    /** Start export */
    exportPrismaClients('test', TestPrismaClients)
    /** End export */
    `
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce(script)
    DatabaseUtils.cleanImport()
    expect(fs.writeFileSync).toBeCalledTimes(1)
  })
})
