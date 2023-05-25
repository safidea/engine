import './setup'
import fs from 'fs-extra'
import AppUtils from '../../src/utils/app.utils'

describe('AppUtils', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV, FDT_APP_NAME: 'testApp' }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('getName', () => {
    it('should return app name from environment variable', () => {
      expect(AppUtils.getName()).toBe('testApp')
    })

    it('should throw error if app name is not set in environment', () => {
      delete process.env.FDT_APP_NAME
      expect(() => AppUtils.getName()).toThrow('FDT_APP_NAME env variable is not set')
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

  describe('registerLibraries', () => {
    it('should register new app library', () => {
      AppUtils.registerLibraries({ testLib: {} }, 'testPackage')
      expect(AppUtils.useLibrary('testLib', 'testPackage')).toBeDefined()
    })

    it('should not overwrite existing libraries', () => {
      AppUtils.registerLibraries({ testLib: {} }, 'testPackage')
      AppUtils.registerLibraries({ anotherLib: {} }, 'testPackage')
      expect(AppUtils.useLibrary('testLib', 'testPackage')).toBeDefined()
      expect(AppUtils.useLibrary('anotherLib', 'testPackage')).toBeDefined()
    })
  })

  describe('useLibrary', () => {
    it('should return library if it is registered', () => {
      AppUtils.registerLibraries({ testLib: {} }, 'testPackage')
      expect(AppUtils.useLibrary('testLib', 'testPackage')).toBeDefined()
    })

    it('should return undefined if package is not registered', () => {
      expect(AppUtils.useLibrary('testLib', 'testPackage2')).toBeUndefined()
    })

    it('should return undefined if library is not registered', () => {
      expect(AppUtils.useLibrary('testLib2', 'testPackage')).toBeUndefined()
    })
  })

  describe('clearImports', () => {
    it('should clear imports file', () => {
      AppUtils.clearImports('testPackage')
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    })
  })

  describe('addImport', () => {
    beforeEach(() => {
      ;(fs.readFileSync as jest.Mock).mockReturnValue('')
    })

    it('should add import line if file does not exist', () => {
      ;(fs.pathExistsSync as jest.Mock).mockReturnValue(false)
      AppUtils.addImport('import { test } from "test"', 'testPackage')
      expect(fs.appendFileSync).toHaveBeenCalledTimes(1)
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
})
