import { faker } from '@faker-js/faker'
import { getRandomUniqueArray } from 'utils'

import type { Api, InOutput, ActionInOutput, TestTable } from '../types/api.type'

const getInOutput = (): InOutput[] =>
  getRandomUniqueArray().map(() => ({
    key: faker.random.word(),
    value: faker.random.word(),
  }))

const getActionInOutput = (): ActionInOutput =>
  getRandomUniqueArray().reduce((acc) => {
    const key = faker.random.word()
    acc[key] = faker.random.word()
    return acc
  }) as ActionInOutput

const getTestTable = (): TestTable[] =>
  getRandomUniqueArray().map(() => ({
    name: faker.random.word(),
    rows: getRandomUniqueArray().map(() =>
      getRandomUniqueArray().reduce((acc) => {
        const field = faker.random.word()
        acc[field] = faker.random.word()
        return acc
      })
    ) as { [fields: string]: string }[],
  }))

const apis: Api[] = getRandomUniqueArray().map(() => {
  const name = faker.random.words()

  const input = getInOutput()

  const actions = getRandomUniqueArray().map(() => ({
    name: faker.random.word(),
    service: faker.random.word(),
    type: faker.random.word(),
    input: getActionInOutput(),
    output: getActionInOutput(),
  }))

  const output = getInOutput()

  const tests = getRandomUniqueArray().map(() => ({
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
