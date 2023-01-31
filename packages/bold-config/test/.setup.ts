import { faker } from '@faker-js/faker'
import { promises as fs } from 'fs'
import { getRandomLengthArray } from 'bold-utils'
import { getDataset as getApiDataset } from 'bold-api'

export const folder = './test/__running__'

export const getDataset = () => {
  return {
    name: faker.random.word(),
    pages: [],
    components: [],
    apis: getRandomLengthArray().map(() => getApiDataset()),
    tables: [],
    theme: {},
    locales: [],
  }
}

beforeAll(async () => {
  await fs.mkdir(folder)
})

afterAll(async () => {
  await fs.rm(folder, { recursive: true, force: true })
})
