import { faker } from '@faker-js/faker'
import { getRandomUniqueArray } from 'utils'

import type { ComponentUI, State, UI } from '../types/component.type'

const getUI = (i = 0): UI => ({
  tag: faker.random.word(),
  class: faker.random.word(),
  children: i < 10 ? getRandomUniqueArray().map(() => getUI(++i)) : 'Hello word',
})

export const componentsMock: ComponentUI[] = getRandomUniqueArray().map(() => {
  const name = faker.random.word()
  const ui = getUI()
  const state = getRandomUniqueArray({ faker: ['random.word', 'random.numeric'] }).reduce(
    (acc: State, { randomWord, randomNumeric }) => {
      acc[randomWord as string] = randomNumeric
      return acc
    },
    {} as State
  )
  const props = getRandomUniqueArray().map(() => faker.random.word())
  return {
    name,
    ui,
    state,
    props,
  }
})
