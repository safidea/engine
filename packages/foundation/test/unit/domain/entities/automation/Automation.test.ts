import { describe, test, expect } from '@jest/globals'
import { Action, Automation } from '@domain/entities/automation/Automation'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'

describe('Automation', () => {
  // As app developer, I want to be warned at build time if my automation has invalid database references (e.g. non existing table or column), in order to allow me to correct it before deploying the application
  test('config validation fail if automation references an invalid field', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [{ type: 'updateTable', fields: { fieldX: 'test' }, table: 'tableA' }]
    const tables = TableMapper.toEntities([
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ])

    // WHEN
    const call = () => new Automation(name, {} as any, actions, tables)

    // THEN
    expect(call).toThrow('field "fieldX" in automation "A" is not defined in table "tableA"')
  })

  test('config validation fail if automation references an invalid table', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [{ type: 'updateTable', fields: {}, table: 'tableX' }]
    const tables = TableMapper.toEntities([
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ])

    // WHEN
    const call = () => new Automation(name, {} as any, actions, tables)

    // THEN
    expect(call).toThrow('table "tableX" in automation "A" is not defined in tables')
  })

  test('config validation fail if automation references an invalid field and a valid field', async () => {
    // GIVEN
    const name = 'A'
    const actions: Action[] = [
      { type: 'updateTable', fields: { fieldA: 'Essentiel', fieldY: 'test' }, table: 'tableA' },
    ]
    const tables = TableMapper.toEntities([
      {
        name: 'tableA',
        fields: [
          {
            name: 'fieldA',
            type: 'single_line_text',
          },
        ],
      },
    ])

    // WHEN
    const call = () => new Automation(name, {} as any, actions, tables)

    // THEN
    expect(call).toThrow('field "fieldY" in automation "A" is not defined in table "tableA"')
  })
})
