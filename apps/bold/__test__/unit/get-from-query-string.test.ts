// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { getFromQueryString } from '../../src/utils/'

const { location } = window

beforeAll(() => {
  delete window.location
  window.location = {
    search: '?user=test',
  }
})

afterAll(() => {
  window.location = location
})

test('should return the correct value', () => {
  expect(getFromQueryString('user')).toBe('test')
})
