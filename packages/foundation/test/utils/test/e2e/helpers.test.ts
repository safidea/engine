import { describe, test, expect } from '@jest/globals'
import { getUrl, generateRecords } from '../../e2e/helpers'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { getDedicatedTmpFolder } from '../../helpers'

describe('E2e Helpers', () => {
  test('getUrl', async () => {
    // GIVEN
    const port = 3000

    // WHEN
    const url = getUrl(port, '/home')

    // THEN
    expect(url).toEqual('http://localhost:3000/home')
  })

  describe('generateRecords', () => {
    test('should generate invoices records with number', async () => {
      // GIVEN
      const folder = getDedicatedTmpFolder()
      const orm = new InMemoryOrm(folder)

      // WHEN
      const { invoices } = await generateRecords(orm, 'invoices', [
        {
          number: 1,
        },
        {
          number: 2,
        },
        {
          number: 3,
        },
      ])

      // THEN
      expect(invoices[0].number).toEqual(1)
      expect(invoices[1].number).toEqual(2)
      expect(invoices[2].number).toEqual(3)
    })
  })
})
