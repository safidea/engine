import { faker } from '@faker-js/faker'
import { getRandomUniqueArray, RandomUniqueObject } from 'utils'

import type { Page, Props } from '../types/page.type'

const pages: Page[] = getRandomUniqueArray().map(() => {
  const path = '/' + faker.internet.domainWord()
  const meta = {
    title: faker.random.words(),
    description: faker.random.words(),
  }
  const components = getRandomUniqueArray().map(() => ({
    id: faker.random.word(),
    type: faker.random.word(),
    props: getRandomUniqueArray({ faker: ['random.word'] }).reduce(
      (acc: Props, { randomWord: key }: RandomUniqueObject) => {
        acc[key as string] = faker.random.word()
        return acc
      },
      {} as Props
    ),
  }))
  const hasContainer = faker.datatype.boolean()
  const fontsVariables = [faker.random.word(), faker.random.word()]

  return {
    path,
    meta,
    components,
    hasContainer,
    fontsVariables,
  }
})

export default pages
