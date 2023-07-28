import { describe, test, expect } from '@jest/globals'
import * as helpers from '../../../specs/fixtures/helpers'
import { Action, Automation } from '@domain/entities/automation/Automation'
import { Table } from '@domain/entities/table/Table'
import { mapDtoToTable } from '@application/mappers/table/TableMapper'

describe('Automation', () => {
  // As app developer, I want to be warned at build time if my automation has invalid database references (e.g. non existing table or column), in order to allow me to correct it before deploying the application
  test('Config validation fail if automation references an invalid field', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [
      { type: 'updateTable', fields: { fieldX: 'test' }, table: 'invoices' },
    ]
    const tables: Table[] = helpers.getTables('invoices').map((tableDto) => mapDtoToTable(tableDto))

    // WHEN
    const call = () => new Automation(name, actions, tables)

    // THEN
    expect(call).toThrow('fieldX in automation A is not defined in table "invoices"')
  })

  test('Config validation fail if automation references an invalid table', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [{ type: 'updateTable', fields: {}, table: 'tableX' }]
    const tables: Table[] = helpers.getTables('invoices').map((tableDto) => mapDtoToTable(tableDto))

    // WHEN
    const call = () => new Automation(name, actions, tables)

    // THEN
    expect(call).toThrow('table tableX in automation A is not defined in tables')
  })

  test('Config validation fail if automation references an invalid field and a valid field', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [
      { type: 'updateTable', fields: { customer: 'Essentiel', fieldY: 'test' }, table: 'invoices' },
    ]
    const tables: Table[] = helpers.getTables('invoices').map((tableDto) => mapDtoToTable(tableDto))

    // WHEN
    const call = () => new Automation(name, actions, tables)

    // THEN
    expect(call).toThrow('fieldY in automation A is not defined in table "invoices"')
  })
})
