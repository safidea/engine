import { faker } from '@faker-js/faker'
import { promises as fs } from 'fs'
import { apisMock } from 'bold-api'
import { pagesMock } from 'bold-page'
import { componentsMock } from 'bold-component'
import { tablesMock } from 'bold-table'
import { themeMock } from 'bold-theme'
import { localesMock } from 'bold-locale'

import type { Config } from '../types/config.type'

export const folder = './__test__/__running__'
export const config: Config = {
  name: faker.random.word(),
  defaultLocale: faker.random.locale(),
  pages: pagesMock,
  components: componentsMock,
  apis: apisMock,
  tables: tablesMock,
  theme: themeMock,
  locales: localesMock,
}

beforeEach(async () => {
  await fs.mkdir(folder)
})

afterEach(async () => {
  await fs.rm(folder, { recursive: true, force: true })
})
