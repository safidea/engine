import './setup'
import fs from 'fs-extra'
import AppUtils from '../../src/utils/app.utils'
import PathUtils from '../../src/utils/path.utils'

jest.mock('../../src/utils/path.utils', () => ({
  getPackageAppsFolder: jest.fn(),
}))

describe('AppUtils', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV, FDT_APP_NAME: 'testApp' }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('getPackageIndexPathFile', () => {
    it('should return correct path', () => {
      const getPackageAppsFolder = PathUtils.getPackageAppsFolder as jest.MockedFunction<
        typeof PathUtils.getPackageAppsFolder
      >
      getPackageAppsFolder.mockReturnValue('testFolderPath')
      expect(AppUtils.getPackageIndexPathFile('testPackage')).toBe('testFolderPath/index.ts')
    })
  })

  describe('getPackagePathFile', () => {
    it('should return correct path', () => {
      const getPackageAppsFolder = PathUtils.getPackageAppsFolder as jest.MockedFunction<
        typeof PathUtils.getPackageAppsFolder
      >
      getPackageAppsFolder.mockReturnValue('testFolderPath')
      expect(AppUtils.getPackagePathFile('testPackage')).toBe('testFolderPath/testApp.ts')
    })
  })

  describe('getName', () => {
    it('should return app name from environment variable', () => {
      expect(AppUtils.getName()).toBe('testApp')
    })

    it('should throw error if app name is not set in environment', () => {
      delete process.env.FDT_APP_NAME
      expect(() => AppUtils.getName()).toThrow('FDT_APP_NAME is not set in .env file')
    })
  })

  describe('getVersion', () => {
    it('should return app version from environment variable', () => {
      process.env.FDT_APP_VERSION = '1.0.0'
      expect(AppUtils.getVersion()).toBe('1.0.0')
    })

    it('should return default version if app version is not set in environment', () => {
      delete process.env.FDT_APP_VERSION
      expect(AppUtils.getVersion()).toBe('0.0.0')
    })
  })

  describe('register', () => {
    it('should register new app library', () => {
      AppUtils.register({ testApp: { testLib: {} } }, 'testPackage')
      expect(AppUtils.useLibrary('testLib')).toBeDefined()
    })

    it('should not overwrite existing libraries', () => {
      AppUtils.register({ testApp: { testLib: {} } }, 'testPackage')
      AppUtils.register({ testApp: { anotherLib: {} } }, 'testPackage')
      expect(AppUtils.useLibrary('testLib')).toBeDefined()
      expect(AppUtils.useLibrary('anotherLib')).toBeDefined()
    })
  })

  describe('addImport', () => {
    beforeEach(() => {
      ;(fs.readFileSync as jest.Mock).mockReturnValue('')
    })

    it('should add import line if file does not exist', () => {
      ;(fs.pathExistsSync as jest.Mock).mockReturnValue(false)
      AppUtils.addImport('import { test } from "test"', 'testPackage')
      expect(fs.appendFileSync).toHaveBeenCalledTimes(2)
    })

    it('should not add import line if it is already in the file', () => {
      ;(fs.pathExistsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue('import { test } from "test"')
      AppUtils.addImport('import { test } from "test"', 'testPackage')
      expect(fs.appendFileSync).not.toHaveBeenCalled()
    })

    it('should add import line if it is not in the file', () => {
      ;(fs.pathExistsSync as jest.Mock).mockReturnValue(true)
      AppUtils.addImport('import { test } from "test"', 'testPackage')
      expect(fs.appendFileSync).toHaveBeenCalled()
    })
  })

  describe('removeAllImports', () => {
    it('should remove all imports for registered packages', () => {
      AppUtils.register({ testApp: { testLib: {} } }, 'testPackage')
      ;(fs.pathExistsSync as jest.Mock).mockReturnValue(true)
      ;(fs.readFileSync as jest.Mock).mockReturnValue('export * as testApp from "./testApp"\n')
      AppUtils.removeAllImports()
      expect(fs.removeSync).toHaveBeenCalled()
      expect(fs.writeFileSync).toHaveBeenCalled()
    })

    it('should not remove anything if no packages are registered', () => {
      AppUtils.removeAllImports()
      expect(fs.removeSync).not.toHaveBeenCalled()
      expect(fs.writeFileSync).not.toHaveBeenCalled()
    })
  })

  describe('getExportLine', () => {
    it('should return correct export line', () => {
      expect(AppUtils.getExportLine()).toBe("export * as testApp from './testApp'")
    })
  })
})
