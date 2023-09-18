import fs from 'fs-extra'
import { describe, test, expect } from '@jest/globals'
import { getDedicatedTmpFolder, clearTmpFolders } from '../helpers'

jest.mock('fs-extra', () => ({
  ensureDirSync: jest.fn(),
  emptyDirSync: jest.fn(),
}))

describe('Shared Helpers', () => {
  test('getDedicatedTmpFolder', async () => {
    // WHEN
    const folder = getDedicatedTmpFolder()

    // THEN
    expect(folder).toEqual(expect.stringContaining('/tmp/'))
    expect(fs.ensureDirSync).toHaveBeenCalledWith(folder)
  })

  test('clearTmpFolders', async () => {
    // WHEN
    clearTmpFolders()

    // THEN
    expect(fs.emptyDirSync).toHaveBeenCalledWith(expect.stringContaining('/tmp'))
  })
})
