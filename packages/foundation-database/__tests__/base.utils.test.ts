import { base } from '../src'
import Config from 'config-test/config.json'

const table = Object.keys(Config.tables)[0]

test('should return a base', () => {
  expect(base(table)).toBeDefined()
})
