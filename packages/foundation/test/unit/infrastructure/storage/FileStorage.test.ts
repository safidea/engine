import { describe, test, expect } from '@jest/globals'
import { helpers } from '../../../utils/unit/fixtures'
import { FileStorage } from '@infrastructure/storage/FileStorage'
import { join } from 'path'
import fs from 'fs-extra'

describe('FileStorage', () => {
  test('should create a file', async () => {
    // GIVEN
    const bucket = 'bucketA'
    const filename = 'fileA.txt'
    const data = 'dataA'
    const folder = helpers.getDedicatedTmpFolder()
    const fileStorage = new FileStorage(folder)

    // WHEN
    await fileStorage.write(bucket, {
      filename,
      data,
    })

    // THEN
    const file = await fs.readFile(join(folder, 'storage', bucket, filename), 'utf8')
    expect(file).toEqual(data)
  })

  test('should list files', async () => {
    // GIVEN
    const bucket = 'bucketA'
    const filename = 'file.txt'
    const data = 'data'
    const folder = helpers.getDedicatedTmpFolder()
    const fileStorage = new FileStorage(folder)
    await Promise.all([
      fs.outputFile(join(folder, 'storage', bucket, 'A' + filename), 'A' + data),
      fs.outputFile(join(folder, 'storage', bucket, 'B' + filename), 'B' + data),
      fs.outputFile(join(folder, 'storage', bucket, 'C' + filename), 'C' + data),
    ])

    // WHEN
    const files = await fileStorage.list(bucket)

    // THEN
    expect(files[0].filename).toEqual('A' + filename)
    expect(files[1].filename).toEqual('B' + filename)
    expect(files[2].filename).toEqual('C' + filename)
    expect(files[0].data.toString()).toEqual('A' + data)
    expect(files[1].data.toString()).toEqual('B' + data)
    expect(files[2].data.toString()).toEqual('C' + data)
  })
})
