import { UpdateTableRecord } from '@application/usecases/table/UpdateTableRecord'
import { describe, test, expect, jest } from '@jest/globals'
import { Record } from '@domain/entities/table/Record'

describe('UpdateTableRecord', () => {
  test('should update a record', async () => {
    // GIVEN
    let updatedRecord: Record = {} as any
    const ormGateway = {
      update: jest.fn((table: string, record: Record) => (updatedRecord = record)),
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
    await new UpdateTableRecord(ormGateway as any, appGateway as any).execute(
      'tableA',
      {
        name: 'test B',
      },
      '1'
    )

    // THEN
    expect(updatedRecord.fields.name).toEqual('test B')
  })
})
