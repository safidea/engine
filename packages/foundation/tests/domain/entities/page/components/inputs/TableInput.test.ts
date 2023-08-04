import { mapDtoToTable } from '@application/mappers/table/TableMapper'
import { TableInput } from '@domain/entities/page/components/inputs/TableInput'
import { Table } from '@domain/entities/table/Table'
import { describe, test, expect } from '@jest/globals'

describe('TableInput Component', () => {
  test('config validation fail if columns reference an invalid field', async () => {
    // GIVEN
    const fieldName = 'fieldA'
    const columns = [
      {
        field: 'fieldX',
        label: 'Field X',
      },
    ]
    const table: Table = mapDtoToTable({
      name: 'tableA',
      fields: [
        {
          name: 'fieldA',
          type: 'single_line_text',
        },
      ],
    })

    // WHEN
    const call = () => new TableInput(fieldName, columns, table, {} as any)

    // THEN
    expect(call).toThrowError('field fieldX in table input columns is not defined in table tableA')
  })

  test.skip('should add a row when click on add label', async () => {
    // GIVEN

    // WHEN

    // THEN
    expect(false).toBe(true)
  })

  test.skip('should remove a row when click on remove button', async () => {
    // GIVEN

    // WHEN

    // THEN
    expect(false).toBe(true)
  })
})
