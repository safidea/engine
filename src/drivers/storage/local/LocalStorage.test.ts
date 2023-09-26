import { describe, test, expect } from '@jest/globals'
import { helpers } from '@test/unit/fixtures'
import { join } from 'path'
import fs from 'fs-extra'
import { LocalStorage } from './LocalStorage'

describe('LocalStorage', () => {
  test('should create a file', async () => {
    // GIVEN
    const bucket = 'bucketA'
    const filename = 'fileA.txt'
    const data = 'dataA'
    const folder = helpers.getDedicatedTmpFolder()
    const storage = new LocalStorage({ folder, domain: 'http://localhost:3000' })
    await storage.configure([{ name: bucket }])

    // WHEN
    await storage.upload(bucket, Buffer.from(data), { filename })

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
    const storage = new LocalStorage({ folder, domain: 'http://localhost:3000' })
    await storage.configure([{ name: bucket }])
    await Promise.all([
      fs.outputFile(join(folder, 'storage', bucket, 'A' + filename), 'A' + data),
      fs.outputFile(join(folder, 'storage', bucket, 'B' + filename), 'B' + data),
      fs.outputFile(join(folder, 'storage', bucket, 'C' + filename), 'C' + data),
    ])

    // WHEN
    const files = await storage.list(bucket)

    // THEN
    expect(files[0].filename).toEqual('A' + filename)
    expect(files[1].filename).toEqual('B' + filename)
    expect(files[2].filename).toEqual('C' + filename)
    expect(files[0].data.toString()).toEqual('A' + data)
    expect(files[1].data.toString()).toEqual('B' + data)
    expect(files[2].data.toString()).toEqual('C' + data)
  })

  test('should read an empty bucket', async () => {
    // GIVEN
    const bucket = 'bucketA'
    const folder = helpers.getDedicatedTmpFolder()
    const storage = new LocalStorage({ folder, domain: 'http://localhost:3000' })
    await storage.configure([{ name: bucket }])

    // WHEN
    const files = await storage.list(bucket)

    // THEN
    expect(files).toEqual([])
  })
})
