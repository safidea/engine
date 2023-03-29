import { faker } from '@faker-js/faker'
import { getRandomUniqueArray } from 'foundation-utils'
import { apisMock } from 'foundation-automation'
import { pagesMock } from 'foundation-page'
import { componentsMock } from 'foundation-component'
import { themeMock } from '../__mocks__/theme.mock'
import { localesMock } from '../__mocks__/locales.mock'

import type { Config } from '../types/config.type'

type Field = {
  name: string
  type: string
  primary?: boolean
  unique?: boolean
  required?: boolean
  default?: string
  table?: string
}

type Table = {
  name: string
  fields: Field[]
}

const tablesMock: Table[] = getRandomUniqueArray().map(() => {
  const name = faker.random.word()
  const fields = getRandomUniqueArray().map(() => ({
    name: faker.random.word(),
    type: faker.random.word(),
  }))

  return {
    name,
    fields,
  }
})

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
