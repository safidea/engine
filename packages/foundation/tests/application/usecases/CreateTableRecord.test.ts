import { CreateTableRecord } from '@application/usecases/table/CreateTableRecord'
import { describe, test, expect } from '@jest/globals'

describe('CreateTableRecord', () => {
  test('should create a record in ORM from DTO', async () => {
    // GIVEN
    const tableGateway = {
      create: () => 1,
      getTableFields: () => [
        {
          name: 'name',
          type: 'single_line_text',
        },
      ],
    }

    // WHEN
    const recordId = await new CreateTableRecord(tableGateway as any).execute('table', {
      name: 'test',
    })

    // THEN
    expect(recordId).toEqual(1)
  })

  test('should throw an error if a field from the record DTO is missing in the table', async () => {
    // GIVEN
    const tableGateway = {
      getTableFields: () => [
        {
          name: 'first_name',
          type: 'text',
        },
      ],
    }

    // WHEN
    const call = () =>
      new CreateTableRecord(tableGateway as any).execute('table', {
        last_name: 'test',
      })

    // THEN
    await expect(call).rejects.toThrowError('Field last_name not found')
  })
})
