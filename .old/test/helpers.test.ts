import { describe, test, expect } from 'bun:test'
import { getDedicatedTmpFolder, clearTmpFolders } from './helpers'

describe('Shared Helpers', () => {
  test('getDedicatedTmpFolder', async () => {
    // WHEN
    const folder = getDedicatedTmpFolder()

    // THEN
    expect(folder).toEqual(expect.stringContaining('/tmp/'))
  })

  test('clearTmpFolders', async () => {
    // WHEN
    clearTmpFolders()
  })
})
