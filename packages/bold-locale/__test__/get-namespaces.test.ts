import { locales } from 'bold-build'
import getNamespaces from '../src/get-namespaces'

test('should get namespaces', () => {
  const locale = locales[0]
  const namespaces = getNamespaces(locale.locale)
  expect(namespaces).toEqual(Object.keys(locale.namespaces || {}))
})
