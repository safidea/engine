import { faker } from '@faker-js/faker'
import { getRandomUniqueArray, RandomUniqueObject } from 'utils'

import type { Locale, Resources } from '../types/locale/locale.type'

export const localesMock: Locale[] = getRandomUniqueArray({ faker: ['random.locale'] }).map(
  ({ randomLocale }) => {
    const locale = randomLocale as string
    const namespaces = getRandomUniqueArray({ faker: ['random.word'] }).reduce(
      (acc: { [key: string]: Resources }, { randomWord: randomNamespace }: RandomUniqueObject) => {
        const namespace = randomNamespace
        const key = faker.random.word()
        const resources = getRandomUniqueArray({ faker: ['random.word'] }).reduce(
          (acc: Resources, { randomWord: randomValue }: RandomUniqueObject) => {
            acc[key as string] = randomValue as string
            return acc
          },
          {} as Resources
        )
        acc[namespace as string] = resources
        return acc
      },
      {} as { [key: string]: Resources }
    )
    return {
      locale,
      namespaces,
    }
  }
)
