import { faker } from '@faker-js/faker'
import { apisMock } from 'foundation-automation'
import { pagesMock } from 'foundation-page'
import { componentsMock } from 'foundation-component'
import { tablesMock } from 'foundation-table'
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
