import { faker } from '@faker-js/faker'
import { getRandomLengthArray, getRandomKeyValue } from 'bold-utils'

import type { Api, InOutput, ActionInOutput, TestTable } from '../types/api.type'

const getInOutput = (): InOutput[] =>
  getRandomLengthArray().map(() => ({
    key: faker.random.word(),
    value: faker.random.word(),
  }))

const getActionInOutput = (): ActionInOutput => getRandomKeyValue() as ActionInOutput

const getTestTable = (): TestTable[] =>
  getRandomLengthArray().map(() => ({
    name: faker.random.word(),
    rows: getRandomLengthArray().map(() => getRandomKeyValue()) as { [fields: string]: string }[],
  }))

const apis: Api[] = getRandomLengthArray().map(() => {
  const name = faker.random.words()

  const input = getInOutput()

  const actions = getRandomLengthArray().map(() => ({
    name: faker.random.word(),
    service: faker.random.word(),
    type: faker.random.word(),
    input: getActionInOutput(),
    output: getActionInOutput(),
  }))

  const output = getInOutput()

  const tests = getRandomLengthArray().map(() => ({
    name: faker.random.word(),
    before: {
      input: getInOutput(),
      tables: getTestTable(),
    },
    after: {
      output: getInOutput(),
      tables: getTestTable(),
    },
  }))

  return {
    name,
    input,
    actions,
    output,
    tests,
  }
})

export default apis
