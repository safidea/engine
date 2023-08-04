import { mapDtoToApp } from '@application/mappers/AppMapper'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { SyncTableRecords } from '@application/usecases/table/SyncTableRecords'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'

describe('SyncTableRecords', () => {
  test.skip('should sync an updated record', async () => {
    // GIVEN
    const orm = {
      update: jest.fn(),
    }
    const app = mapDtoToApp(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
            ],
          },
        ],
      },
      UnstyledUI
    )

    // WHEN
    await new SyncTableRecords(orm as any, app).execute('tableA', [
      {
        id: '1',
        fieldA: 'test updated',
      },
    ])

    // THEN
    expect(orm.update).toBeCalledWith('tableA', [
      mapDtoToRecord(
        'tableA',
        {
          id: '1',
          fieldA: 'test updated',
        },
        app.getTableFields('tableA')
      ),
    ])
  })
})
