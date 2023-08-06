/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { RenderPageForm } from '@application/usecases/page/RenderPageForm'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { Context } from '@domain/entities/page/Context'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
import { FetcherGateway } from '@adapter/spi/fetcher/FetcherGateway'
import { App } from '@domain/entities/app/App'
import { FormMapper } from '@adapter/api/page/mappers/components/FormMapper'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { RecordMapper } from '@adapter/api/app/mappers/RecordMapper'
import { Record } from '@domain/entities/app/Record'

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
      UnstyledUI
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
    const fetcher = NativeFetcher('http://localhost')
    const fetcherGateway = new FetcherGateway(fetcher, app)
    const syncRecord = jest.fn(() => Promise.resolve({ error: undefined }))
    fetcherGateway.syncTableRecords = () => syncRecord
    const FormComponent = await new RenderPageForm(fetcherGateway, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByLabelText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.value).toBe('')
    expect(syncRecord).toBeCalledWith(expect.arrayContaining([expect.any(Record)]))
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
      UnstyledUI
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
    const fetcher = NativeFetcher('http://localhost')
    const fetcherGateway = new FetcherGateway(fetcher, app)
    const syncRecord = jest.fn(() => Promise.resolve({ error: undefined }))
    fetcherGateway.syncTableRecords = () => syncRecord
    const FormComponent = await new RenderPageForm(fetcherGateway, app).execute(form, {} as any)
    render(<FormComponent />)

    // WHEN
    await user.click(screen.getByText(/Add row/i))
    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const inputs = screen.queryAllByPlaceholderText('Name')
    expect(inputs.length).toBe(0)
    expect(syncRecord).toBeCalledWith(expect.arrayContaining([expect.any(Record), expect.any(Record)]))
  })

  test.skip('should render a form with default record values', async () => {
    // GIVEN
    const tables = TableMapper.toEntities([
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
    ])
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
      tables
    )
    const fetch = jest.fn(async () => ({
      status: 200,
      json: () =>
        Promise.resolve({ id: '1', fieldA: 'test A', items: [{ id: '2', fieldB: 'test B' }] }),
    }))
    const fetcherGateway = new FetcherGateway({ fetch } as any, {} as App)
    const context = new Context({ id: '1' })
    const FormComponent = await new RenderPageForm(fetcherGateway).execute(form, context)

    // WHEN
    render(<FormComponent />)

    // THEN
    expect(fetch).toBeCalledWith('/api/table/tableA/1?enriched=true', {
      method: 'GET',
    })
    const fieldA = screen.getByLabelText('Field A') as HTMLInputElement
    expect(fieldA.value).toBe('test A')
    const fieldB = screen.getByPlaceholderText('Field B') as HTMLInputElement
    expect(fieldB.value).toBe('test B')
  })

  test.skip('should update a record when submit a form', async () => {
    // GIVEN
    const user = userEvent.setup()
    const tables = TableMapper.toEntities([
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
    ])
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
      tables
    )
    const fetch = jest.fn()
    fetch.mockImplementationOnce(async () => ({
      status: 200,
      json: () =>
        Promise.resolve({
          id: '1',
          fieldA: 'test A',
          items: [
            { id: '2', fieldB: 'test B' },
            { id: '3', fieldB: 'test C' },
          ],
        }),
    }))
    fetch.mockImplementationOnce(async () => ({
      status: 200,
      json: () => Promise.resolve(undefined),
    }))
    const fetcherGateway = new FetcherGateway({ fetch } as any, {} as App)
    const context = new Context({ id: '1' })
    const FormComponent = await new RenderPageForm(fetcherGateway).execute(form, context)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByLabelText('Field A'), ' updated')
    await user.type(screen.getAllByPlaceholderText('Field B')[0], ' updated')
    await user.click(screen.getByText(/Add item/i))
    await user.type(screen.getAllByPlaceholderText('Field B')[2], 'new row')
    await user.click(screen.getByText(/Update/i))
    await screen.findByText('Update')

    // THEN
    expect(fetch.mock.calls[1][0]).toBe('/api/table/tableA/1')
    expect(fetch.mock.calls[1][1]).toStrictEqual({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: '1',
        fieldA: 'test A updated',
        items: {
          create: [
            {
              fieldB: 'new row',
            },
          ],
          update: [
            {
              id: '2',
              fieldB: 'test B updated',
            },
          ],
        },
      }),
    })
  })
})
