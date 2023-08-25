/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import userEvent from '@testing-library/user-event'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { RenderPageForm } from '@application/usecases/page/RenderPageForm'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { Context } from '@domain/entities/page/Context'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'
import { FormMapper } from '@adapter/api/page/mappers/components/FormMapper'
import { AppMapper } from '@adapter/api/app/AppMapper'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { Record } from '@domain/entities/orm/Record'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { FilterMapper } from '@adapter/spi/orm/mappers/FilterMapper'
import { IsAnyOfFilter } from '@domain/entities/orm/filters/IsAnyOfFilter'

describe('RenderPageForm', () => {
  test('should clear the form after submit', async () => {
    // GIVEN
    const user = userEvent.setup()
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [{ name: 'name', type: 'single_line_text' }],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        inputs: [{ field: 'name', label: 'Name' }],
        submit: { label: 'Save', loadingLabel: 'Saving...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn(async () => ({ error: undefined, tables: {} }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByLabelText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.value).toBe('')
    expect(syncRecords).toBeCalledWith({
      records: expect.arrayContaining([expect.any(Record)]),
      resources: [
        {
          table: 'tableA',
          filters: expect.arrayContaining([expect.any(IsAnyOfFilter)]),
        },
      ],
    })
  })

  test('should clear a table in a form after submit', async () => {
    // GIVEN
    const user = userEvent.setup()
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [{ name: 'items', type: 'multiple_linked_records', table: 'items' }],
          },
          {
            name: 'items',
            fields: [
              { name: 'name', type: 'single_line_text' },
              { name: 'tableA', type: 'single_linked_record', table: 'tableA' },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        inputs: [
          {
            field: 'items',
            label: 'Items',
            columns: [
              {
                field: 'name',
                label: 'Name',
                placeholder: 'Name',
              },
            ],
            addLabel: 'Add row',
          },
        ],
        submit: { label: 'Save', loadingLabel: 'Saving...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn(async () => ({ error: undefined, tables: {} }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.click(screen.getByText(/Add row/i))
    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const inputs = screen.queryAllByPlaceholderText('Name')
    expect(inputs.length).toBe(0)
    expect(syncRecords).toBeCalledWith({
      records: expect.arrayContaining([expect.any(Record), expect.any(Record)]),
      resources: [
        {
          filters: expect.arrayContaining([expect.any(IsAnyOfFilter)]),
          table: 'tableA',
        },
        {
          table: 'items',
        },
      ],
    })
  })

  test('should render a form with default record values', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              { name: 'fieldA', type: 'single_line_text' },
              { name: 'items', type: 'multiple_linked_records', table: 'tableB' },
            ],
          },
          {
            name: 'tableB',
            fields: [{ name: 'fieldB', type: 'single_line_text' }],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        recordIdToUpdate: '{{path.params.id}}',
        inputs: [
          {
            field: 'fieldA',
            label: 'Field A',
          },
          {
            field: 'items',
            label: 'Items',
            columns: [
              {
                field: 'fieldB',
                label: 'Field B',
                placeholder: 'Field B',
              },
            ],
          },
        ],
        submit: { label: 'Save', loadingLabel: 'Saving...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn(async () => ({
      error: undefined,
      tables: {
        tableA: RecordMapper.toEntities(
          [
            {
              id: '1',
              created_time: new Date().toISOString(),
              fieldA: 'test A',
              items: ['2'],
            },
          ],
          app.getTableByName('tableA')
        ),
        tableB: RecordMapper.toEntities(
          [
            {
              id: '2',
              created_time: new Date().toISOString(),
              fieldB: 'test B',
            },
            {
              id: '3',
              created_time: new Date().toISOString(),
              fieldB: 'test C',
            },
          ],
          app.getTableByName('tableB')
        ),
      },
    }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const context = new Context({ id: '1' })
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, context)

    // WHEN
    render(<FormComponent />)

    // THEN
    expect(syncRecords).toBeCalledWith({
      resources: [
        {
          table: 'tableA',
          filters: FilterMapper.toEntities([
            {
              field: 'id',
              operator: 'is_any_of',
              value: ['1'],
            },
          ]),
        },
        {
          table: 'tableB',
        },
      ],
    })
    const fieldA = screen.getByLabelText('Field A') as HTMLInputElement
    expect(fieldA.value).toBe('test A')
    const [rowA, rowB] = screen.getAllByPlaceholderText('Field B') as HTMLInputElement[]
    expect(rowA.value).toBe('test B')
    expect(rowB).toBeUndefined()
  })

  test('should update a record when submit a form', async () => {
    // GIVEN
    const user = userEvent.setup()
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              { name: 'fieldA', type: 'single_line_text' },
              { name: 'items', type: 'multiple_linked_records', table: 'tableB' },
            ],
          },
          {
            name: 'tableB',
            fields: [
              { name: 'fieldB', type: 'single_line_text' },
              { name: 'tableA', type: 'single_linked_record', table: 'tableA' },
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        recordIdToUpdate: '{{path.params.id}}',
        inputs: [
          {
            field: 'fieldA',
            label: 'Field A',
          },
          {
            field: 'items',
            label: 'Items',
            columns: [
              {
                field: 'fieldB',
                label: 'Field B',
                placeholder: 'Field B',
              },
            ],
            addLabel: 'Add item',
          },
        ],
        submit: { label: 'Update', loadingLabel: 'Updating...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn()
    syncRecords.mockImplementationOnce(async () => ({
      error: undefined,
      tables: {
        tableA: RecordMapper.toEntities(
          [
            {
              id: '1',
              created_time: new Date().toISOString(),
              fieldA: 'test A',
              items: ['2', '3'],
            },
          ],
          app.getTableByName('tableA')
        ),
        tableB: RecordMapper.toEntities(
          [
            {
              id: '2',
              created_time: new Date().toISOString(),
              fieldB: 'test B',
            },
            {
              id: '3',
              created_time: new Date().toISOString(),
              fieldB: 'test C',
            },
          ],
          app.getTableByName('tableB')
        ),
      },
    }))
    syncRecords.mockImplementationOnce(async () => ({
      error: undefined,
      tables: {},
    }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const context = new Context({ id: '1' })
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, context)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByLabelText('Field A'), ' updated')
    await user.type(screen.getAllByPlaceholderText('Field B')[0], ' updated')
    await user.click(screen.getByText(/Add item/i))
    await user.type(screen.getAllByPlaceholderText('Field B')[2], 'new row')
    await user.click(screen.getByText(/Update/i))
    await screen.findByText('Update')

    // THEN
    const { records } = syncRecords.mock.calls[1][0]
    expect(records[0].getCurrentState()).toEqual('update')
    expect(records[1].getCurrentState()).toEqual('update')
    expect(records[2].getCurrentState()).toEqual('read')
    expect(records[3].getCurrentState()).toEqual('create')
    const recordsDto = RecordMapper.toDtos(records)
    expect(recordsDto[0].id).toEqual('1')
    expect(recordsDto[0].fieldA).toEqual('test A updated')
    expect(recordsDto[0].items).toEqual(['2', '3', expect.any(String)])
    expect(recordsDto[1].id).toEqual('2')
    expect(recordsDto[1].fieldB).toEqual('test B updated')
    expect(recordsDto[2].id).toEqual('3')
    expect(recordsDto[2].fieldB).toEqual('test C')
    expect(recordsDto[3].id).toEqual(expect.any(String))
    expect(recordsDto[3].fieldB).toEqual('new row')
  })

  test('should remove a row when click on remove button in a table form', async () => {
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
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        recordIdToUpdate: '{{path.params.id}}',
        inputs: [
          {
            field: 'items',
            label: 'Items',
            columns: [
              {
                field: 'fieldA',
                label: 'Field A',
                placeholder: 'Field A',
              },
            ],
            addLabel: 'Add item',
          },
        ],
        submit: { autosave: true, loadingLabel: 'Updating...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn()
    syncRecords.mockImplementationOnce(async () => ({
      error: undefined,
      tables: {
        tableA: RecordMapper.toEntities(
          [{ id: '1', created_time: new Date().toISOString(), items: ['2', '3'] }],
          app.getTableByName('tableA')
        ),
        tableB: RecordMapper.toEntities(
          [
            { id: '2', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textA' },
            { id: '3', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textB' },
          ],
          app.getTableByName('tableB')
        ),
      },
    }))
    syncRecords.mockImplementationOnce(async () => ({
      error: undefined,
      tables: {
        tableA: RecordMapper.toEntities(
          [{ id: '1', created_time: new Date().toISOString(), items: ['2', '3'] }],
          app.getTableByName('tableA')
        ),
        tableB: RecordMapper.toEntities(
          [{ id: '3', created_time: new Date().toISOString(), tableA: '1', fieldA: 'textB' }],
          app.getTableByName('tableB')
        ),
      },
    }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const context = new Context({ id: '1' })
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, context)
    render(<FormComponent />)

    // WHEN
    await user.click(screen.getAllByText(/Remove/i)[0])
    await waitForElementToBeRemoved(screen.queryByText(/Updating.../i), { timeout: 3000 })

    // THEN
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBe(2)

    // AND
    const { records } = syncRecords.mock.calls[1][0]
    expect(records[0].getCurrentState()).toEqual('update')
    expect(records[0].getFieldValue('items')).toEqual(['3'])
    expect(records[1].getCurrentState()).toEqual('delete')
    expect(records[1].id).toEqual('2')
  })

  test('should be able to save a table form if a row has been added then removed', async () => {
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
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        inputs: [
          {
            field: 'items',
            label: 'Items',
            columns: [
              {
                field: 'fieldA',
                label: 'Field A',
                placeholder: 'Field A',
              },
            ],
            addLabel: 'Add item',
          },
        ],
        submit: { label: 'Save', loadingLabel: 'Saving...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecords = jest.fn(async () => ({
      error: undefined,
      tables: {},
    }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.click(screen.getByText(/Add item/i))
    await user.type(screen.getAllByPlaceholderText('Field A')[0], 'Text A')
    await user.click(screen.getByText(/Add item/i))
    await user.type(screen.getAllByPlaceholderText('Field A')[1], 'Text B')
    await user.click(screen.getAllByText(/Remove/i)[0])
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const [{ records }] = syncRecords.mock.calls[0] as any
    expect(records.length).toBe(2)
    expect(records[0].getCurrentState()).toBe('create')
    expect(records[1].getCurrentState()).toBe('create')
    expect(records[1].getFieldValue('fieldA')).toBe('Text B')
  })

  test('should be able to select linked record and submit the form', async () => {
    // GIVEN
    const user = userEvent.setup()
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              {
                name: 'item',
                type: 'single_linked_record',
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
            ],
          },
        ],
      },
      { ui: UnstyledUI }
    )
    const form = FormMapper.toEntity(
      {
        type: 'form',
        table: 'tableA',
        inputs: [
          {
            field: 'item',
            label: 'Item',
            placeholder: 'Select item',
            linkedLabelField: 'fieldA',
          },
        ],
        submit: { label: 'Save', loadingLabel: 'Saving...' },
      },
      UnstyledUI,
      app.tables
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const syncRecordsHook = jest.fn(() => ({
      error: undefined,
      tables: {
        tableB: RecordMapper.toEntities(
          [
            {
              id: '1',
              created_time: new Date().toISOString(),
              fieldA: 'Text A',
            },
            {
              id: '2',
              created_time: new Date().toISOString(),
              fieldA: 'Text B',
            },
          ],
          app.getTableByName('tableB')
        ),
      },
      isLoading: false,
    }))
    const syncRecords = jest.fn(async () => ({
      error: undefined,
      tables: {},
    }))
    fetcherSpi.getSyncRecordsFunction = () => syncRecords
    fetcherSpi.getSyncRecordsHook = () => syncRecordsHook
    const FormComponent = await new RenderPageForm(fetcherSpi, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.selectOptions(screen.getByLabelText(/Item/i), 'Text B')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const [{ records }] = syncRecords.mock.calls[0] as any
    expect(records.length).toBe(1)
    expect(records[0].getCurrentState()).toBe('create')
    expect(records[0].getFieldValue('item')).toBe('2')
  })
})
