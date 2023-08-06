import { FieldDto } from '@application/dtos/table/FieldDto'
import { mapDtoToField } from '@adapter/api/table/mappers/FieldMapper'
import { mapDtoToRecord } from '@adapter/spi/orm/mappers/RecordMapper'
import { Field } from '@domain/entities/table/Field'
import { InMemoryOrm } from '@infrastructure/orm/InMemoryOrm'
import { describe, test, expect } from '@jest/globals'

describe('InMemoryOrm', () => {
  test('should update a record by id', async () => {
    // GIVEN
    const inMemoryOrm = new InMemoryOrm('../../tmp')
    await inMemoryOrm.setDB({
      tableA: [
        {
          id: '1',
          name: 'test A',
        },
      ],
    })
    const fields: Field[] = [
      {
        name: 'name',
        type: 'single_line_text',
      },
    ].map((field) => mapDtoToField(field as FieldDto))

    // WHEN
    const update = mapDtoToRecord(
      'tableA',
      {
        id: '1',
        name: 'test B',
      },
      fields
    )
    await inMemoryOrm.softUpdateById('tableA', update, '1')

    // THEN
    const db = await inMemoryOrm.getDB()
    const updatedRecord = db.tableA.find((record: any) => record.id === '1')
    expect(updatedRecord?.name).toEqual('test B')
  })
})
