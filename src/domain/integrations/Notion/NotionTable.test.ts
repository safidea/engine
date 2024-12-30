import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { NotionTable } from './NotionTable'
import type { INotionTableSpi, NotionTableServices } from './NotionTable'
import type { NotionConfig } from '.'
import type { Bucket } from '@domain/entities/Bucket'
import { OrFilter } from '@domain/entities/Filter/Or'
import { OnOrAfterDateFilter } from '@domain/entities/Filter/date/OnOrAfter'

let spi: INotionTableSpi
let services: NotionTableServices
let config: NotionConfig
let bucket: Bucket
let notionTable: NotionTable

beforeEach(() => {
  // GIVEN
  spi = {
    id: 'table-id',
    name: 'Test Table',
    insert: mock(),
    insertMany: mock(),
    update: mock(),
    updateMany: mock(),
    retrieve: mock(),
    archive: mock(),
    list: mock(),
  }
  services = {
    // @ts-expect-error mock
    logger: {
      debug: mock(),
    },
    // @ts-expect-error mock
    idGenerator: { forListener: mock(() => 'listener-id') },
    // @ts-expect-error mock
    fetcher: { get: mock(() => new Response()) },
  }
  // @ts-expect-error mock
  config = { pollingInterval: 1 }
  // @ts-expect-error mock
  bucket = {
    save: mock().mockResolvedValue({ url: 'https://bucket-url/file' }),
  }
  // GIVEN
  notionTable = new NotionTable(spi, services, config, bucket)
})

describe('insert', () => {
  it('should call SPI insert with preprocessed page', async () => {
    // GIVEN
    const page = { title: 'Test Page' }

    // WHEN
    await notionTable.insert(page)

    // THEN
    expect(spi.insert).toHaveBeenCalledWith(page)
  })

  it('should save file URLs to the bucket', async () => {
    // GIVEN
    const page = {
      title: 'Test Page',
      files: [{ name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' }],
    }

    // WHEN
    await notionTable.insert(page)

    // THEN
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file1', data: expect.any(Buffer) })
  })

  it('should replace file URL with the bucket URL', async () => {
    // GIVEN
    const page = {
      title: 'Test Page',
      files: [{ name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' }],
    }

    // WHEN
    await notionTable.insert(page)

    // THEN
    // @ts-expect-error mock
    const processedPage = spi.insert.mock.calls[0][0]
    expect(processedPage.files[0].url).toBe('https://bucket-url/file')
  })

  it('should not modify page without file URLs', async () => {
    // GIVEN
    const page = { title: 'Test Page', files: [] }

    // WHEN
    await notionTable.insert(page)

    // THEN
    expect(bucket.save).not.toHaveBeenCalled()
  })
})

describe('insertMany', () => {
  it('should call SPI insertMany with preprocessed pages', async () => {
    // GIVEN
    const pages = [{ title: 'Page 1' }, { title: 'Page 2' }]

    // WHEN
    await notionTable.insertMany(pages)

    // THEN
    expect(spi.insertMany).toHaveBeenCalledWith(pages)
  })

  it('should save file URLs for all pages to the bucket', async () => {
    // GIVEN
    const pages = [
      {
        title: 'Page 1',
        files: [
          { name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' },
        ],
      },
      {
        title: 'Page 2',
        files: [
          { name: 'file2', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file2' },
        ],
      },
    ]

    // WHEN
    await notionTable.insertMany(pages)

    // THEN
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file1', data: expect.any(Buffer) })
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file2', data: expect.any(Buffer) })
  })

  it('should replace file URLs with bucket URLs for all pages', async () => {
    // GIVEN
    const pages = [
      {
        title: 'Page 1',
        files: [
          { name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' },
        ],
      },
      {
        title: 'Page 2',
        files: [
          { name: 'file2', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file2' },
        ],
      },
    ]

    // WHEN
    await notionTable.insertMany(pages)

    // THEN
    // @ts-expect-error mock
    const processedPages = spi.insertMany.mock.calls[0][0]
    expect(processedPages[0].files[0].url).toBe('https://bucket-url/file')
    expect(processedPages[1].files[0].url).toBe('https://bucket-url/file')
  })
})

describe('update', () => {
  it('should call SPI update with preprocessed page', async () => {
    // GIVEN
    const id = 'page-id'
    const page = { title: 'Updated Title' }

    // WHEN
    await notionTable.update(id, page)

    // THEN
    expect(spi.update).toHaveBeenCalledWith(id, page)
  })

  it('should save file URLs to the bucket during update', async () => {
    // GIVEN
    const id = 'page-id'
    const page = {
      title: 'Updated Title',
      files: [{ name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' }],
    }

    // WHEN
    await notionTable.update(id, page)

    // THEN
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file1', data: expect.any(Buffer) })
  })

  it('should replace file URL with bucket URL during update', async () => {
    // GIVEN
    const id = 'page-id'
    const page = {
      title: 'Updated Title',
      files: [{ name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' }],
    }

    // WHEN
    await notionTable.update(id, page)

    // THEN
    // @ts-expect-error mock
    const processedPage = spi.update.mock.calls[0][1]
    expect(processedPage.files[0].url).toBe('https://bucket-url/file')
  })

  it('should not modify page without file URLs during update', async () => {
    // GIVEN
    const id = 'page-id'
    const page = { title: 'Updated Title', files: [] }

    // WHEN
    await notionTable.update(id, page)

    // THEN
    expect(bucket.save).not.toHaveBeenCalled()
  })
})

describe('startPolling', () => {
  it('should log polling start message', () => {
    // WHEN
    notionTable.startPolling()

    // THEN
    expect(services.logger.debug).toHaveBeenCalledWith(
      'starting polling on Notion table "Test Table" with interval 1s'
    )

    // Cleanup
    notionTable.stopPolling()
  })
})

describe('updateMany', () => {
  it('should call SPI updateMany with preprocessed pages', async () => {
    // GIVEN
    const pages = [
      { id: '1', page: { title: 'Page 1' } },
      { id: '2', page: { title: 'Page 2' } },
    ]

    // WHEN
    await notionTable.updateMany(pages)

    // THEN
    expect(spi.updateMany).toHaveBeenCalledWith(pages)
  })

  it('should save file URLs for all pages during updateMany', async () => {
    // GIVEN
    const pages = [
      {
        id: '1',
        page: {
          title: 'Page 1',
          files: [
            { name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' },
          ],
        },
      },
      {
        id: '2',
        page: {
          title: 'Page 2',
          files: [
            { name: 'file2', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file2' },
          ],
        },
      },
    ]

    // WHEN
    await notionTable.updateMany(pages)

    // THEN
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file1', data: expect.any(Buffer) })
    expect(bucket.save).toHaveBeenCalledWith({ name: 'file2', data: expect.any(Buffer) })
  })

  it('should replace file URLs with bucket URLs for all pages during updateMany', async () => {
    // GIVEN
    const pages = [
      {
        id: '1',
        page: {
          title: 'Page 1',
          files: [
            { name: 'file1', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file1' },
          ],
        },
      },
      {
        id: '2',
        page: {
          title: 'Page 2',
          files: [
            { name: 'file2', url: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/file2' },
          ],
        },
      },
    ]

    // WHEN
    await notionTable.updateMany(pages)

    // THEN
    // @ts-expect-error mock
    const processedPages = spi.updateMany.mock.calls[0][0]
    expect(processedPages[0].page.files[0].url).toBe('https://bucket-url/file')
    expect(processedPages[1].page.files[0].url).toBe('https://bucket-url/file')
  })

  it('should not modify pages without file URLs during updateMany', async () => {
    // GIVEN
    const pages = [
      { id: '1', page: { title: 'Page 1', files: [] } },
      { id: '2', page: { title: 'Page 2', files: [] } },
    ]

    // WHEN
    await notionTable.updateMany(pages)

    // THEN
    expect(bucket.save).not.toHaveBeenCalled()
  })
})

describe('retrieve', () => {
  it('should call SPI retrieve with the given ID', async () => {
    // GIVEN
    const id = 'page-id'

    // WHEN
    await notionTable.retrieve(id)

    // THEN
    expect(spi.retrieve).toHaveBeenCalledWith(id)
  })
})

describe('archive', () => {
  it('should call SPI archive with the given ID', async () => {
    // GIVEN
    const id = 'page-id'

    // WHEN
    await notionTable.archive(id)

    // THEN
    expect(spi.archive).toHaveBeenCalledWith(id)
  })
})

describe('list', () => {
  it('should call SPI list without a filter', async () => {
    // WHEN
    await notionTable.list()

    // THEN
    expect(spi.list).toHaveBeenCalledWith(undefined)
  })

  it('should call SPI list with a filter', async () => {
    // GIVEN
    const filter = new OrFilter([new OnOrAfterDateFilter('insertd_time', '2023-01-01T00:00:00Z')])

    // WHEN
    await notionTable.list(filter)

    // THEN
    expect(spi.list).toHaveBeenCalledWith(filter)
  })
})

describe('startPolling', () => {
  it('should log polling start message', () => {
    // WHEN
    notionTable.startPolling()

    // THEN
    expect(services.logger.debug).toHaveBeenCalledWith(
      'starting polling on Notion table "Test Table" with interval 1s'
    )

    // Cleanup
    notionTable.stopPolling()
  })

  it('should poll for new pages and invoke listeners', async () => {
    // GIVEN
    const mockListener = mock(async () => {})
    // @ts-expect-error mock
    spi.list.mockResolvedValue([{ id: 'page-1', insertd_time: '2023-01-01T12:00:00Z' }])
    await notionTable.onInsert(mockListener)

    // WHEN
    notionTable.startPolling()
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Allow polling to run once

    // THEN
    expect(mockListener).toHaveBeenCalledWith({
      id: 'page-1',
      insertd_time: '2023-01-01T12:00:00Z',
    })

    // Cleanup
    notionTable.stopPolling()
  })
})

describe('stopPolling', () => {
  it('should stop polling and log stop message', () => {
    // GIVEN
    notionTable.startPolling()

    // WHEN
    notionTable.stopPolling()

    // THEN
    expect(services.logger.debug).toHaveBeenCalledWith(
      'stopping polling on Notion table "Test Table"'
    )
  })
})

describe('onInsert', () => {
  it('should generate a listener ID and log subscription', async () => {
    // GIVEN
    const callback = async () => {}

    // WHEN
    const id = await notionTable.onInsert(callback)

    // THEN
    expect(id).toBe('listener-id')
    expect(services.logger.debug).toHaveBeenCalledWith(
      'subscribed to insert events on Notion table "Test Table"'
    )
  })

  it('should invoke the callback when a page is insertd', async () => {
    // GIVEN
    const mockCallback = mock(async () => {})
    const page = { id: 'page-1', title: 'Test Page' }
    // @ts-expect-error mock
    spi.list.mockResolvedValue([page])

    await notionTable.onInsert(mockCallback)

    // WHEN
    notionTable.startPolling()
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Allow polling to run once

    // THEN
    expect(mockCallback).toHaveBeenCalledWith(page)

    // Cleanup
    notionTable.stopPolling()
  })
})
