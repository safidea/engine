/**
 * @jest-environment jsdom
 */
import React from 'react'
import { describe, test, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { UnstyledUI } from '@infrastructure/ui/UnstyledUI'
import { FetcherSpi } from '@adapter/spi/fetcher/FetcherSpi'
import { AppMapper } from '@adapter/api/app/AppMapper'
import { NativeFetcher } from '@infrastructure/fetcher/NativeFetcher'
import { ListMapper } from '@adapter/api/page/mappers/components/ListMapper'
import { RenderPageList } from '@application/usecases/page/RenderPageList'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'

describe('RenderPageList', () => {
  test('should render a list with text and number columns', async () => {
    // GIVEN
    const app = AppMapper.toEntity(
      {
        tables: [
          {
            name: 'tableA',
            fields: [
              { name: 'textField', type: 'single_line_text' },
              { name: 'numberField', type: 'number' },
            ],
          },
        ],
      },
      { ui: UnstyledUI, log: console.log, storage: {} as any  }
    )
    const list = ListMapper.toEntity(
      {
        type: 'list',
        table: 'tableA',
        columns: [
          {
            field: 'textField',
            label: 'Text',
          },
          {
            field: 'numberField',
            label: 'Number',
          },
        ],
      },
      UnstyledUI,
      app.tables
    )
    const record = RecordMapper.toEntity(
      {
        id: '1',
        created_time: new Date().toISOString(),
        textField: 'text',
        numberField: 10,
      },
      app.getTableByName('tableA')
    )
    const fetcher = new NativeFetcher('http://localhost')
    const fetcherSpi = new FetcherSpi(fetcher, app)
    const useSyncRecords = jest.fn(() => ({
      error: undefined,
      tables: {
        [list.table]: [record],
      },
      isLoading: false,
    }))
    fetcherSpi.getSyncRecordsHook = () => useSyncRecords
    const List = await new RenderPageList(fetcherSpi).execute(list)

    // THEN
    render(<List />)

    // WHEN
    const textField = screen.getByText(String(record.getFieldValue('textField')))
    const numberField = screen.getByText(String(record.getFieldValue('textField')))
    expect(textField).toBeDefined()
    expect(numberField).toBeDefined()
  })
})
