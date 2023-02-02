import { faker } from '@faker-js/faker'
import { getRandomUniqueArray, capitalize } from 'utils'

import type { ComponentUI, State, UI } from '../types/component.type'

export const componentsMock: ComponentUI[] = getRandomUniqueArray().map(() => {
  const name = faker.word.noun()
  const props = getRandomUniqueArray().map(() => faker.word.noun().replace(/-/g, ''))
  const state = getRandomUniqueArray({ faker: ['word.noun', 'random.numeric'] }).reduce(
    (acc: State, { wordNoun, randomNumeric }) => {
      acc[wordNoun as string] = randomNumeric
      return acc
    },
    {} as State
  )

  const propsToSet = [...props]
  const stateToSet = { ...state }

  const getUI = (i = 0): UI => {
    const element: UI = {
      tag: 'div',
      class: faker.word.noun(),
    }
    const length = propsToSet.length + Object.keys(stateToSet).length

    if (propsToSet.length > 0) {
      const propKey = propsToSet.pop()
      element['data-' + faker.word.noun()] = `{${propKey}}`
    }

    if (Object.keys(stateToSet).length > 0) {
      const stateKey = Object.keys(stateToSet).pop()
      if (stateKey) {
        delete stateToSet[stateKey]
        element['data-' + faker.word.noun()] = `{${stateKey}}`
        element['data-' + faker.word.noun()] = `{() => set${capitalize(stateKey)}(${stateKey} + 1)}`
      }
    }

    element.children =
      i < length ? getRandomUniqueArray().map(() => getUI(++i)) : faker.company.catchPhrase()
    return element
  }

  const ui = getUI()
  return {
    name,
    ui,
    state,
    props,
  }
})
