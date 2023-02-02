import { faker } from '@faker-js/faker'
import { getRandomUniqueArray } from 'utils'

import type { Theme } from '../types/theme/theme.type'

const darkMode = faker.random.word()
const container = {
  center: faker.datatype.boolean(),
}
const extend = {
  colors: getRandomUniqueArray().map(() => ({
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
    name: 'Roboto',
    key: 'primary',
    weight: [100, 300, 400, 500, 700, 900],
  },
  {
    name: 'Inter',
    key: 'secondary',
    weight: [100, 300, 400, 500, 700, 900],
  },
]

export const themeMock: Theme = {
  darkMode,
  container,
  extend,
  fonts,
}
