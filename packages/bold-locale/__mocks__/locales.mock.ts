import { faker } from '@faker-js/faker'
import { getRandomLengthArray, getRandomKeyValue } from 'bold-utils'

import type { Locale, Resources } from '../types/locale.type'

const locales: Locale[] = getRandomLengthArray().map(() => {
  const locale = faker.random.locale()
  const namespaces = getRandomKeyValue({
    value: getRandomKeyValue({ value: getRandomKeyValue() }),
  }) as { [namespace: string]: Resources }

  return {
    locale,
    namespaces,
  }
})

export default locales
