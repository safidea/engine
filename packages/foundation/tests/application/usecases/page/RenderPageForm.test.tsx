/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { RenderPageForm } from '@application/usecases/page/RenderPageForm'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { mapDtoToForm } from '@application/mappers/page/components/FormMapper'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { mapDtoToTable } from '@application/mappers/table/TableMapper'
import { FormDto } from '@application/dtos/page/components/FormDto'
import { TableDto } from '@application/dtos/table/TableDto'

describe('RenderPageForm', () => {
  test('should clear the form after submit', async () => {
    // GIVEN
    const user = userEvent.setup()
    const table = mapDtoToTable({
      name: 'tableA',
      fields: [{ name: 'name', type: 'single_line_text' }],
    })
    const formDto: FormDto = {
      type: 'form',
      table: 'tableA',
      inputs: [{ field: 'name', label: 'Name' }],
      submit: { label: 'Save', loadingLabel: 'Saving...' },
    }
    const fetch = jest.fn(async () => ({ json: () => Promise.resolve({ id: '1' }) }))
    const fetcherGateway = new FetcherGateway({ fetch } as any)
    const form = mapDtoToForm(formDto, UnstyledUI, [table])
    const FormComponent = new RenderPageForm(fetcherGateway).execute(form)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByLabelText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.value).toBe('')
    expect(fetch).toBeCalledWith('/api/table/tableA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'John' }),
    })
  })

  test('should clear a table in a form after submit', async () => {
    // GIVEN
    const user = userEvent.setup()
    const tables = [
      {
        name: 'tableA',
        fields: [{ name: 'items', type: 'multiple_linked_records', table: 'tableB' }],
      },
      {
        name: 'tableB',
        fields: [{ name: 'name', type: 'single_line_text' }],
      },
    ].map((table) => mapDtoToTable(table as TableDto))
    const formDto: FormDto = {
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
        },
      ],
      submit: { label: 'Save', loadingLabel: 'Saving...' },
    }
    const fetch = jest.fn(async () => ({ json: () => Promise.resolve({ id: '1' }) }))
    const fetcherGateway = new FetcherGateway({ fetch } as any)
    const form = mapDtoToForm(formDto, UnstyledUI, tables)
    const FormComponent = new RenderPageForm(fetcherGateway).execute(form)
    render(<FormComponent />)

    // WHEN
    await user.type(screen.getByPlaceholderText('Name'), 'John')
    await user.click(screen.getByText(/Save/i))
    await screen.findByText('Save')

    // THEN
    const input = screen.getByPlaceholderText('Name') as HTMLInputElement
    expect(input.value).toBe('')
    expect(fetch).toBeCalledWith('/api/table/tableA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: {
          create: [
            {
              name: 'John',
            },
          ],
        },
      }),
    })
  })
})
