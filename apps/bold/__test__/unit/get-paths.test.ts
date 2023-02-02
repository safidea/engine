jest.mock('../../src/config', () => jest.requireActual('../../__mocks__/config'))

import { pages } from '../../src/config'
import getPaths from '../../src/utils/get-paths'

test('should get paths', () => {
  const paths = getPaths()
  expect(paths).toEqual(pages.map((p) => p.path))
})
