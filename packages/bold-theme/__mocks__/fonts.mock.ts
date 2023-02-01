import { faker } from '@faker-js/faker'
import type { FontOptions } from '../types/theme.type'

const primary: FontOptions = {
  subsets: [faker.random.word()],
  variable: faker.random.word(),
  weight: ['300', '400', '500', '700'],
}

const secondary: FontOptions = {
  subsets: [faker.random.word()],
  variable: faker.random.word(),
  weight: ['300', '400', '500', '700'],
}

const fonts = [primary.variable, secondary.variable]

export default fonts
