jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))

import { locales } from '../../src/config'
import getNamespaces from '../../src/utils/get-namespaces'

test('should get namespaces', () => {
  const locale = locales[0]
  const namespaces = getNamespaces(locale.locale)
  expect(namespaces).toEqual(Object.keys(locale.namespaces || {}))
})
