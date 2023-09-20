import { Scripter } from '@entities/services/scripter/Scripter'
import { describe, test, expect } from '@jest/globals'

describe('Scripter', () => {
  test('should return a formula', async () => {
    // GIVEN
    const formula = '1 + 1'

    // WHEN
    const result = new Scripter(formula).run()

    // THEN
    expect(result).toEqual(2)
  })

  test('should return a formula with a context', async () => {
    // GIVEN
    const formula = '1 + 1 + a'
    const context = {
      a: 1,
    }

    // WHEN
    const result = new Scripter(formula, context).run()

    // THEN
    expect(result).toEqual(3)
  })

  test('should throw an error if a value is not defined in context', async () => {
    // GIVEN
    const formula = '1 + 1 + a + (b ? b : 0)'
    const context = {
      a: 1,
    }

    // WHEN
    const call = () => new Scripter(formula, context).run()

    // THEN
    expect(call).toThrowError('b is not defined')
  })
})
