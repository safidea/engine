import { faker } from '@faker-js/faker'
import { getRandomLengthArray } from 'bold-utils'

import type { Theme } from '../types/theme.type'

const darkMode = faker.random.word()
const container = {
  center: faker.datatype.boolean(),
}
const extend = {
  colors: getRandomLengthArray().map(() => ({
    [faker.random.word()]: {
      50: faker.internet.color(),
      100: faker.internet.color(),
      200: faker.internet.color(),
      300: faker.internet.color(),
      400: faker.internet.color(),
      500: faker.internet.color(),
      600: faker.internet.color(),
      700: faker.internet.color(),
      800: faker.internet.color(),
      900: faker.internet.color(),
    },
  })),
}

const fonts = [
  {
    name: faker.random.word(),
    key: faker.random.word(),
    weight: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  },
]

const theme: Theme = {
  darkMode,
  container,
  extend,
  fonts,
}

export default theme
