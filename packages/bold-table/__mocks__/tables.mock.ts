import { faker } from '@faker-js/faker'
import { getRandomLengthArray } from 'bold-utils'

import type { Table } from '../types/table.type'

const tables: Table[] = getRandomLengthArray().map(() => {
  const name = faker.random.word()
  const fields = getRandomLengthArray().map(() => ({
    name: faker.random.word(),
    type: faker.random.word(),
  }))

  return {
    name,
    fields,
  }
})

export default tables
