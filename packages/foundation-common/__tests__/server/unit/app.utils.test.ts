import fs from 'fs-extra'
import AppUtils from '@common/server/utils/app.utils'
import PathUtils from '@common/server/utils/path.utils'

jest.mock('fs-extra')
jest.mock('@common/server/apps')

const folderPath = PathUtils.getCommonAppsFolder()

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getName', () => {
  it('should throw an error if APP_NAME is not set', () => {
    delete process.env.APP_NAME
    expect(() => AppUtils.getName()).toThrow('APP_NAME is not set in .env file')
  })

  it('should return the value of APP_NAME', () => {
    process.env.APP_NAME = 'test'
    expect(AppUtils.getName()).toBe('test')
  })
})

describe('importLib', () => {
  it('should throw an error if app is not configured', () => {
    expect(() => AppUtils.importLib('test')).toThrow('App "test" is not configured')
  })

  it('should throw an error if lib is not configured', () => {
    process.env.APP_NAME = 'base'
    expect(() => AppUtils.importLib('test')).toThrow('Lib "test" is not configured')
  })

  it('should return the lib', () => {
    expect(AppUtils.importLib('lib')).toEqual(expect.any(Object))
  })
})

describe('addImport', () => {
  it('should create the file if it does not exist', () => {
    const pathExistsSync = fs.pathExistsSync as jest.MockedFunction<typeof fs.pathExistsSync>
    pathExistsSync.mockReturnValueOnce(false)
    AppUtils.addImport('test')
    expect(fs.ensureFileSync).toHaveBeenCalledWith(folderPath + '/base.ts')
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      folderPath + '/index.ts',
      "export * as base from './base'\n"
    )
  })

  it('should not create the file if it exists', () => {
    AppUtils.addImport('test')
    expect(fs.ensureFileSync).not.toHaveBeenCalled()
  })

  it('should not append the import line if it already exists', () => {
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce('test\n')
    AppUtils.addImport('test')
    expect(fs.appendFileSync).not.toHaveBeenCalled()
  })

  it('should append the import line to the file', () => {
    AppUtils.addImport('test')
    expect(fs.appendFileSync).toHaveBeenCalledWith(folderPath + '/base.ts', 'test\n')
  })
})

describe('removeAllImports', () => {
  it('should remove the file if it exists', () => {
    AppUtils.removeAllImports()
    expect(fs.removeSync).toHaveBeenCalledWith(folderPath + '/base.ts')
  })

  it('should remove the export line from the index file', () => {
    const readFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
    readFileSync.mockReturnValueOnce(
      "export * as test from './test'\nexport * as base from './base'\n"
    )
    AppUtils.removeAllImports()
    expect(fs.readFileSync).toHaveBeenCalledWith(folderPath + '/index.ts', 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      folderPath + '/index.ts',
      "export * as test from './test'\n",
      'utf8'
    )
  })
})

describe('getExportLine', () => {
  it('should return the export line', () => {
    expect(AppUtils.getExportLine()).toBe("export * as base from './base'")
  })
})
