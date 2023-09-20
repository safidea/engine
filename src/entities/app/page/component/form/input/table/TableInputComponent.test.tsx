/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableInputComponent } from './TableInputComponent'
import { TableList } from '@entities/app/table/TableList'
import { RecordMapper } from '@adapters/mappers/database/record/RecordMapper'
import { Table } from '@entities/app/table/Table'

describe('TableInputComponent Component', () => {
  test('config validation fail if columns reference an invalid field', async () => {
    // GIVEN
    const fieldName = 'fieldA'
    const columns = [
      {
        field: 'fieldX',
        label: 'Field X',
      },
    ]
    const tables = new TableList(
      [
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
      {
        database: {} as any,
      } as any
    )

    // WHEN
    const call = () =>
      new TableInputComponent(
        { label: 'test', type: 'table', field: fieldName, columns, addLabel: 'add' },
        { database: {} as any } as any,
        { tables } as any
      )

    // THEN
    expect(call).toThrowError('field fieldX in table input columns is not defined in table tableA')
  })

  test('should remove a row when click on remove button', async () => {
    // GIVEN
    const user = userEvent.setup()
    const tables = new TableList(
      [
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
      { database: {} as any } as any
    )
    const TableInputComponentUI = await new TableInputComponent(
      {
        type: 'table',
        label: 'test',
        field: 'items',
        columns: [
          {
            field: 'fieldA',
            label: 'Field A',
          },
        ],
        addLabel: 'add',
      },
      { database: {} as any } as any,
      { tables } as any
    ).render()
    const updateRecord = jest.fn()
    const addRecord = jest.fn()
    const removeRecord = jest.fn()
    const currentRecord = RecordMapper.toPersisted(
      { id: '1', created_time: new Date().toISOString(), items: ['2', '3'] },
      tables.getByName('tableA') as Table
    )
    const records = RecordMapper.toManyPersisted(
      [
        { id: '2', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textA' },
        { id: '3', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textB' },
      ],
      tables.getByName('tableB') as Table
    )
    render(
      <TableInputComponentUI
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
