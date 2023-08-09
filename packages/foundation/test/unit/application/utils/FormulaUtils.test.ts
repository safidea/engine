import { describe, test, expect } from '@jest/globals'
import { runFormula } from '@application/utils/FormulaUtils'

describe('FormulaUtils', () => {
  test('should return a formula', async () => {
    // GIVEN
    const formula = '1 + 1'

    // WHEN
    const result = await runFormula(formula)

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
    const result = await runFormula(formula, context)

    // THEN
    expect(result).toEqual(3)
  })
})
