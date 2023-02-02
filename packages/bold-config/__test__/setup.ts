import { faker } from '@faker-js/faker'
import { promises as fs } from 'fs'
import { apisMock } from 'bold-api'
import { pagesMock } from 'bold-page'
import { componentsMock } from 'bold-component'
import { tablesMock } from 'bold-table'
import { themeMock } from '../__mocks__/theme.mock'
import { localesMock } from '../__mocks__/locales.mock'

import type { Config } from '../types/config.type'

export const folder = './__test__/__running__'
export const config: Config = {
  name: faker.random.word(),
  defaultLocale: faker.random.locale(),
  localeRedirect: faker.datatype.boolean(),
  pages: pagesMock,
  components: componentsMock,
  apis: apisMock,
  tables: tablesMock,
  theme: themeMock,
  locales: localesMock,
}

beforeAll(async () => {
  await fs.mkdir(folder)
})

afterAll(async () => {
  await fs.rm(folder, { recursive: true, force: true })
})
