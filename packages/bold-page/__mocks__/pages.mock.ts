import { faker } from '@faker-js/faker'
import { getRandomUniqueArray, RandomUniqueObject } from 'utils'

import type { Page, Props, Meta, Component } from '../types/page.type'

import { componentsMock } from 'bold-component'

const pages: Page[] = getRandomUniqueArray().map(() => {
  const path = '/' + faker.internet.domainWord()
  const meta: Meta = {
    robots: faker.random.words(),
    twitter: faker.random.words(),
    image: faker.image.imageUrl(),
    domain: faker.internet.domainName(),
    title: faker.random.words(),
    description: faker.random.words(),
    keywords: faker.random.words(),
    author: faker.name.fullName(),
  }
  const components: Component[] = getRandomUniqueArray().map(() => ({
    id: faker.random.word(),
    type: componentsMock[faker.datatype.number({ min: 0, max: componentsMock.length - 1 })].name,
    props: getRandomUniqueArray({ faker: ['random.word'] }).reduce(
      (acc: Props, { randomWord: key }: RandomUniqueObject) => {
        acc[key as string] = faker.random.word()
        return acc
      },
      {} as Props
    ),
  }))

  return {
    path,
    meta,
    components,
  }
})

export default pages
