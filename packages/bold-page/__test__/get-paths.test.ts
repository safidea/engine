import { pages } from 'bold-build'
import getPaths from '../src/get-paths'

test('should get paths', () => {
  const paths = getPaths()
  expect(paths).toEqual(pages.map((p) => p.path))
})
