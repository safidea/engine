import { describe, test, expect } from '@jest/globals'
import { HandlebarsTemplater } from './HandlebarsTemplater'

describe('HandlebarsTemplating', () => {
  describe('add helper', () => {
    test('should add 3 numbers', async () => {
      // GIVEN
      const context = { a: 1, b: 2, c: 3 }
      const templating = new HandlebarsTemplater().compile('{{add a b c}}')

      // WHEN
      const result = templating.render(context)

      // THEN
      expect(result).toEqual('6')
    })
  })
})
