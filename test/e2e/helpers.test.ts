import { describe, test, expect } from 'bun:test'
import { getUrl, generateRecords, copyAppFile } from './helpers'
import { getDedicatedTmpFolder } from '../helpers'
import INVOICES_CONFIG from '../../examples/invoices/config'
import { JsonDatabase } from '@drivers/database/json/JsonDatabase'
import fs from 'fs-extra'
import path from 'path'

describe('E2e Helpers', () => {
  test('should get app url', async () => {
    // GIVEN
    const port = 3000

    // WHEN
    const url = getUrl(port, '/home')

    // THEN
    expect(url).toEqual('http://localhost:3000/home')
  })

  test('should copy a file in app folder', async () => {
    // GIVEN
    const folder = getDedicatedTmpFolder()

    // WHEN
    copyAppFile('invoices', 'templates/invoice.html', folder)

    // THEN
    expect(fs.existsSync(path.join(folder, 'templates/invoice.html'))).toBeTruthy()
  })

  test('should generate invoices records with number', async () => {
    // GIVEN
    const folder = getDedicatedTmpFolder()
    const database = new JsonDatabase({ folder })

    // WHEN
    const { invoices, entities } = await generateRecords(INVOICES_CONFIG, database, 'invoices', [
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
