import { faker } from '@faker-js/faker'
import { getRandomLengthArray, getRandomKeyValue } from 'bold-utils'

import type { Page, Props } from '../types/page.type'

const pages: Page[] = getRandomLengthArray().map(() => {
  const path = '/' + faker.internet.domainWord()
  const meta = {
    title: faker.random.words(),
    description: faker.random.words(),
  }
  const components = getRandomLengthArray().map(() => ({
    id: faker.random.word(),
    type: faker.random.word(),
    props: getRandomKeyValue({ value: getRandomKeyValue() }) as Props,
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
