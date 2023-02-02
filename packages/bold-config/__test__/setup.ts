import { configMock } from '../__mocks__/config.mock'
import { promises as fs } from 'fs'

export const folder = './__test__/__running__'
export const config = configMock

beforeAll(async () => {
  await fs.mkdir(folder)
})

afterAll(async () => {
  await fs.rm(folder, { recursive: true, force: true })
})
