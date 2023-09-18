/**
 * @jest-environment jsdom
 */
import React from 'react'
import { AppMapper } from '@adapters/api/app/AppMapper'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'
import { TableInput } from '@entities/app/page/component/form/input/table/TableInputComponent'
import UnstyledUI from '@drivers/ui/UnstyledUI'
import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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
    const table = TableMapper.toEntity({
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

  test('should remove a row when click on remove button', async () => {
    // GIVEN
    const user = userEvent.setup()
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'items',
                type: 'multiple_linked_records',
                table: 'tableB',
              },
            ],
          },
          {
            name: 'tableB',
            fields: [
              {
                name: 'fieldA',
                type: 'single_line_text',
              },
              {
                name: 'tableA',
                type: 'single_linked_record',
                table: 'tableA',
              },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const TableInputUI = new TableInput(
      'items',
      [
        {
          field: 'fieldA',
          label: 'Field A',
        },
      ],
      app.getTableByName('tableB'),
      UnstyledUI.TableInputUI
    ).renderUI()
    const updateRecord = jest.fn()
    const addRecord = jest.fn()
    const removeRecord = jest.fn()
    const currentRecord = RecordMapper.toEntity(
      { id: '1', created_time: new Date().toISOString(), items: ['2', '3'] },
      app.getTableByName('tableA')
    )
    const records = RecordMapper.toEntities(
      [
        { id: '2', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textA' },
        { id: '3', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textB' },
      ],
      app.getTableByName('tableB')
    )
    render(
      <TableInputUI
        updateRecord={updateRecord}
        addRecord={addRecord}
        removeRecord={removeRecord}
        currentRecord={currentRecord}
        records={records}
      />
    )

    // WHEN
    await user.click(screen.getAllByText(/Remove/i)[0])

    // THEN
    expect(removeRecord).toHaveBeenCalledWith('items', '2')
  })
})
