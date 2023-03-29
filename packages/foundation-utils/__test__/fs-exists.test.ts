import { promises as fs } from 'fs'
import { fsExists } from '../src'

export const folder = './__test__/__running__'

beforeAll(async () => {
  await fs.mkdir(folder)
})

afterAll(async () => {
  await fs.rm(folder, { recursive: true, force: true })
})

describe('folder', () => {
  const path = folder + '/folder'

  it('should exist', async () => {
    await fs.mkdir(path)
    expect(await fsExists(path)).toBe(true)
  })

  it('should not exist', async () => {
    await fs.rm(path, { recursive: true, force: true })
    expect(await fsExists(path)).toBe(false)
  })
})

describe('file', () => {
  const path = folder + '/file.txt'

  it('should exist', async () => {
    await fs.writeFile(path, 'Hello word')
    expect(await fsExists(path)).toBe(true)
  })

  it('should not exist', async () => {
    await fs.unlink(path)
    expect(await fsExists(path)).toBe(false)
  })
})
