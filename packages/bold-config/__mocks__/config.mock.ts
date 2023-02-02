import { faker } from '@faker-js/faker'
import { apisMock } from 'bold-api'
import { pagesMock } from 'bold-page'
import { componentsMock } from 'bold-component'
import { tablesMock } from 'bold-table'
import { themeMock } from '../__mocks__/theme.mock'
import { localesMock } from '../__mocks__/locales.mock'

import type { Config } from '../types/config.type'

export const configMock: Config = {
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
