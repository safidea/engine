import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { Record } from '@domain/entities/table/Record'
import { describe, test, expect } from '@jest/globals'

describe('CreateTableRecord', () => {
  test('should create a record in ORM from DTO', async () => {
    // GIVEN
    const ormGateway = {
      create: () => 1,
    }
    const appGateway = {
      getTableFields: () => [
        {
          name: 'name',
          type: 'single_line_text',
        },
      ],
    }

    // WHEN
    const recordId = await new CreateTableRecord(ormGateway as any, appGateway as any).execute(
      'table',
      {
        name: 'test',
      }
    )

    // THEN
    expect(recordId).toEqual(1)
  })

  test('should throw an error if a field from the record DTO is missing in the table', async () => {
    // GIVEN
    const appGateway = {
      getTableFields: () => [
        {
          name: 'first_name',
          type: 'text',
        },
      ],
    }

    // WHEN
    const call = () =>
      new CreateTableRecord({} as any, appGateway as any).execute('table', {
        last_name: 'test',
      })

    // THEN
    await expect(call).rejects.toThrowError('Field last_name not found')
  })

  test('should create a record with a default value', async () => {
    // GIVEN
    const ormGateway = {
      create: (table: string, record: Record) => record.fields,
    }
    const appGateway = {
      getTableFields: () => [
        {
          name: 'name',
          type: 'single_line_text',
          default: 'test',
        },
      ],
    }

    // WHEN
    const record = await new CreateTableRecord(ormGateway as any, appGateway as any).execute(
      'table',
      {}
    )

    // THEN
    expect(record).toEqual({
      name: 'test',
    })
  })
})
