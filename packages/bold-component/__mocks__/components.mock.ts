import { faker } from '@faker-js/faker'
import { getRandomLengthArray, getRandomKeyValue } from 'bold-utils'

import type { ComponentUI, UI } from '../types/component.type'

const components: ComponentUI[] = getRandomLengthArray().map(() => {
  const name = faker.random.word()
  const ui = getRandomKeyValue({
    value: [getRandomKeyValue({ value: [getRandomKeyValue()] })],
  }) as UI
  return {
    name,
    ui,
  }
})

export default components
