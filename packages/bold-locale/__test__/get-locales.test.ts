import { locales } from 'bold-build'
import getLocales from '../src/get-locales'

import type { Locale } from '../types/locale.type'

test('should get locales', () => {
  const result = getLocales()
  expect(result).toEqual(locales.map((t: Locale) => t.locale))
})
