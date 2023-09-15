import { describe, test, expect } from '@jest/globals'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'
import { ActionMapper } from '@entities/app/automation/ActionMapper'
import { Record } from '@entities/services/database/record/Record'
import { HandlebarsTemplating } from '@drivers/templating/HandlebarsTemplating'

describe('UpdateRecordAction', () => {
  // As app developer, I want to be warned at build time if my automation has invalid database references (e.g. non existing table or column), in order to allow me to correct it before deploying the application
  test('config validation fail if update_record action references an invalid field', async () => {
    // GIVEN
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
    const call = () =>
      ActionMapper.toEntities(
        [
          {
            type: 'update_record',
            fields: { fieldX: 'test' },
            table: 'tableA',
            name: 'update_record',
            recordId: '1',
          },
        ],
        tables,
        {
          templating: new HandlebarsTemplating(),
        }
      )

    // THEN
    expect(call).toThrow(
      'field "fieldX" in action "update_record" is not defined in table "tableA"'
    )
  })

  test('config validation fail if update_record action references an invalid table', async () => {
    // GIVEN
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
    const call = () =>
      ActionMapper.toEntities(
        [
          {
            type: 'update_record',
            fields: {},
            table: 'tableX',
            name: 'update_record',
            recordId: '1',
          },
        ],
        tables,
        {
          templating: new HandlebarsTemplating(),
        }
      )

    // THEN
    expect(call).toThrow('table "tableX" in action "update_record" is not defined in tables')
  })

  test('config validation fail if update_record action references an invalid field and a valid field', async () => {
    // GIVEN
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
    const call = () =>
      ActionMapper.toEntities(
        [
          {
            type: 'update_record',
            fields: { fieldA: 'Essentiel', fieldY: 'test' },
            table: 'tableA',
            name: 'update_record',
            recordId: '1',
          },
        ],
        tables,
        {
          templating: new HandlebarsTemplating(),
        }
      )

    // THEN
    expect(call).toThrow(
      'field "fieldY" in action "update_record" is not defined in table "tableA"'
    )
  })

  test('should update a record when execute action', async () => {
    // GIVEN
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
    const updateTableRecord = {
      execute: jest.fn(),
    } as any
    const createAutomationContextFromRecord = {
      execute: jest.fn(async () => ({ data: { fieldA: 'test' } })),
    } as any
    const action = ActionMapper.toEntity(
      {
        type: 'update_record',
        fields: { fieldA: '{{trigger.text}}' },
        table: 'tableA',
        name: 'update_record',
        recordId: '1',
      },
      tables,
      {
        templating: new HandlebarsTemplating(),
      }
    )

    // WHEN
    await action.execute({ trigger: { text: 'test' } }, {
      updateTableRecord,
      createAutomationContextFromRecord,
    } as any)

    // THEN
    expect(updateTableRecord.execute).toHaveBeenCalledWith('tableA', expect.any(Record), '1')
  })
})
