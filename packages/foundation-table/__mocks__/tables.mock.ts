import { faker } from '@faker-js/faker'
import { getRandomUniqueArray } from 'utils'

import type { Table } from '../types/table.type'

const tables: Table[] = getRandomUniqueArray().map(() => {
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

export default tables
