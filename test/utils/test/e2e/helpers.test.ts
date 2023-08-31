import { describe, test, expect } from '@jest/globals'
import { getUrl, generateRecords } from '../../e2e/helpers'
import { JsonOrm } from '@infrastructure/orm/JsonOrm'
import { getDedicatedTmpFolder } from '../../helpers'
import INVOICES_TEMPLATE from '@templates/invoices/app'

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
      const orm = new JsonOrm(folder)

      // WHEN
      const { invoices, entities } = await generateRecords(INVOICES_TEMPLATE, orm, 'invoices', [
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
      expect(entities[0].invoices).toHaveLength(1)
    })
  })
})
