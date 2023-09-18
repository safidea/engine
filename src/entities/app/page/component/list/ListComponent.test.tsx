/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Column, GroupBy, List, SortBy } from '@entities/app/page/component/List'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import UnstyledUI from '@drivers/ui/UnstyledUI'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'

Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: 'http://localhost' },
})

describe('List Component', () => {
  test('config validation fail if table reference an invalid table', async () => {
    // GIVEN
    const tableName = 'tableA'

    // WHEN
    const call = () => new List(tableName, [], [], [], {} as any, [])

    // THEN
    expect(call).toThrow('tableA is not defined in tables')
  })

  test("config validation fail if column type button doesn't have a buttonLabel", async () => {
    // GIVEN
    const tableName = 'tableA'
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
    const columns: Column[] = [
      {
        label: 'Action',
        type: 'button',
      },
    ]

    // WHEN
    const call = () => new List(tableName, [], [], columns, {} as any, tables)

    // THEN
    expect(call).toThrow('buttonLabel is not defined in button type column')
  })

  test('config validation fail if groupBy reference an invalid field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const groupBy: GroupBy[] = [
      {
        field: 'fieldX',
        order: 'desc',
      },
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
    const call = () => new List(tableName, groupBy, [], [], {} as any, tables)

    // THEN
    expect(call).toThrow('field fieldX in groupBy is not defined in table tableA')
  })

  test('config validation fail if sortBy reference an invalid field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldX',
        order: 'desc',
      },
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
    const call = () => new List(tableName, [], sortBy, [], {} as any, tables)

    // THEN
    expect(call).toThrow('field fieldX in sortBy is not defined in table tableA')
  })

  test('should sort records in desc order for a text field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldA',
        order: 'desc',
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
    const records = RecordMapper.toEntities(
      [
        {
          id: '1',
          created_time: new Date().toISOString(),
          fieldA: 'a',
        },
        {
          id: '2',
          created_time: new Date().toISOString(),
          fieldA: 'b',
        },
        {
          id: '3',
          created_time: new Date().toISOString(),
          fieldA: 'c',
        },
      ],
      table
    )

    // WHEN
    const sortedRecords = new List(tableName, [], sortBy, [], {} as any, [table]).sortRecords({
      records,
      sortBy,
      fields: table.fields,
    })

    // THEN
    expect(sortedRecords.map((r) => r.id)).toEqual(['3', '2', '1'])
  })

  test('should sort records in desc order for a datetime field', async () => {
    // GIVEN
    const tableName = 'tableA'
    const sortBy: SortBy[] = [
      {
        field: 'fieldA',
        order: 'desc',
      },
    ]
    const table = TableMapper.toEntity({
      name: 'tableA',
      fields: [
        {
          name: 'fieldA',
          type: 'datetime',
        },
      ],
    })
    const records = RecordMapper.toEntities(
      [
        {
          id: '1',
          created_time: new Date().toISOString(),
          fieldA: new Date('2020-01-01').toISOString(),
        },
        {
          id: '2',
          created_time: new Date().toISOString(),
          fieldA: new Date('2021-01-01').toISOString(),
        },
        {
          id: '3',
          created_time: new Date().toISOString(),
          fieldA: new Date('2022-01-01').toISOString(),
        },
      ],
      table
    )

    // WHEN
    const sortedRecords = new List(tableName, [], sortBy, [], {} as any, [table]).sortRecords({
      records,
      sortBy,
      fields: table.fields,
    })

    // THEN
    expect(sortedRecords.map((r) => r.id)).toEqual(['3', '2', '1'])
  })

  test('should display a column in button format', async () => {
    // GIVEN
    const tableName = 'tableA'
    const columns: Column[] = [
      {
        field: 'fieldA',
        label: 'Field A',
      },
      {
        label: 'Action',
        type: 'button',
        buttonLabel: 'Open',
        action: {
          type: 'open_url',
          url: 'https://example.com',
        },
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
    const ListComponent = new List(tableName, [], [], columns, UnstyledUI.ListUI, [
      table,
    ]).renderUI()

    // WHEN
    render(
      <ListComponent
        records={[
          RecordMapper.toEntity(
            { id: '1', created_time: new Date().toISOString(), fieldA: 'test' },
            table
          ),
        ]}
      />
    )

    // THEN
    const button = screen.getByText('Action')
    expect(button).toBeDefined()
  })

  test('should display a button with a redirect action', async () => {
    // GIVEN
    const user = userEvent.setup()
    const tableName = 'tableA'
    const columns: Column[] = [
      {
        field: 'fieldA',
        label: 'Field A',
      },
      {
        label: 'Action',
        type: 'button',
        buttonLabel: 'Redirect',
        action: {
          type: 'redirect',
          path: '/tableA/:id',
        },
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
    const ListComponent = new List(tableName, [], [], columns, UnstyledUI.ListUI, [
      table,
    ]).renderUI()

    // WHEN
    render(
      <ListComponent
        records={[
          RecordMapper.toEntity(
            { id: '1', created_time: new Date().toISOString(), fieldA: 'test' },
            table
          ),
        ]}
      />
    )

    // AND
    await user.click(screen.getByText(/Redirect/i))

    // THEN
    expect(window.location.href).toEqual('/tableA/1')
  })
})
