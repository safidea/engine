jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))

import { locales } from '../../src/config'
import { getLocales } from '../../src/utils'

import type { Locale } from 'foundation-config'

test('should get locales', () => {
  const result = getLocales()
  expect(result).toEqual(locales.map((t: Locale) => t.locale))
})
