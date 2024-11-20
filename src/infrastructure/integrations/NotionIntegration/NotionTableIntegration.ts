import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { INotionTableIntegration } from '@adapter/spi/integrations/NotionTableSpi'
import type { NotionTablePage, NotionTablePageProperties } from '@domain/integrations/NotionTable'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  PageObjectResponse,
  DatabaseObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'
import { NotionIntegration } from '.'
import { subSeconds, format } from 'date-fns'

export class NotionTableIntegration implements INotionTableIntegration {
  constructor(
    private _notion: Client,
    private _database: DatabaseObjectResponse
  ) {}

  get name() {
    return this._database.title.map((title) => title.plain_text).join('')
  }

  create = async (page: NotionTablePageProperties) => {
    const properties = this._preprocessProperties(page)
    return NotionIntegration.retryIf502Error(async () => {
      const createdPage = await this._notion.pages.create({
        parent: {
          database_id: this._database.id,
        },
        properties,
      })
      if (!('properties' in createdPage)) {
        throw new Error('Page does not have properties')
      }
      return this._postprocessPage(createdPage)
    })
  }

  createMany = async (pages: NotionTablePageProperties[]) => {
    const pagesCreated: NotionTablePage[] = []
    for (const page of pages) {
      const pageCreated = await this.create(page)
      pagesCreated.push(pageCreated)
    }
    return pagesCreated
  }

  update = async (id: string, page: NotionTablePageProperties) => {
    const properties = this._preprocessProperties(page)
    return NotionIntegration.retryIf502Error(async () => {
      const updatedPage = await this._notion.pages.update({
        page_id: id,
        properties,
      })
      if (!('properties' in updatedPage)) {
        throw new Error('Page does not have properties')
      }
      return this._postprocessPage(updatedPage)
    })
  }

  retrieve = async (id: string) => {
    return NotionIntegration.retryIf502Error(async () => {
      const page = await this._notion.pages.retrieve({ page_id: id })
      if (!('properties' in page)) {
        throw new Error('Page does not have properties')
      }
      return this._postprocessPage(page)
    })
  }

  archive = async (id: string) => {
    await NotionIntegration.retryIf502Error(async () => {
      await this._notion.pages.update({
        page_id: id,
        archived: true,
      })
    })
  }

  list = async (filter?: FilterDto) => {
    const query: QueryDatabaseParameters = {
      database_id: this._database.id,
    }
    if (filter) {
      query.filter = this._convertFilter(filter)
    }
    return NotionIntegration.retryIf502Error(async () => {
      const pages = await this._notion.databases.query(query)
      return pages.results.map((page) => {
        if (page.object !== 'page' || !('properties' in page)) {
          throw new Error('Not a page')
        }
        return this._postprocessPage(page)
      })
    })
  }

  private _preprocessProperties = (
    properties: NotionTablePageProperties
  ): CreatePageParameters['properties'] => {
    const pageProperties: CreatePageParameters['properties'] = {}
    for (const key in properties) {
      const property = this._database.properties[key]
      if (property) {
        switch (property.type) {
          case 'title':
            pageProperties[key] = {
              type: 'title',
              title: [
                {
                  text: {
                    content: String(properties[key]),
                  },
                },
              ],
            }
            break
        }
      }
    }
    return pageProperties
  }

  private _postprocessPage = (page: PageObjectResponse): NotionTablePage => {
    const properties: NotionTablePageProperties = {}
    for (const key in page.properties) {
      const property = page.properties[key]
      switch (property.type) {
        case 'title':
          properties[key] = property.title
            .map((title) => {
              if ('text' in title) {
                return title.text.content
              }
              return ''
            })
            .join('')
          break
      }
    }
    return {
      id: page.id,
      properties,
      createdTime: page.created_time,
    }
  }

  // TODO: fix two levels deep : https://developers.notion.com/reference/post-database-query-filter#compound-filter-conditions
  private _convertFilter = (filter: FilterDto): QueryDatabaseParameters['filter'] => {
    if ('and' in filter) {
      return {
        // eslint-disable-next-line
        // @ts-ignore
        and: filter.and.map(this._convertFilter),
      }
    } else if ('or' in filter) {
      return {
        // eslint-disable-next-line
        // @ts-ignore
        or: filter.or.map(this._convertFilter),
      }
    }
    const { operator, field } = filter
    const formatDate = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:00XXX")
    switch (operator) {
      case 'Is':
        return {
          property: field,
          rich_text: {
            equals: filter.value,
          },
        }
      case 'IsAfterNumberOfSecondsSinceNow':
        if (field === 'created_time') {
          return {
            timestamp: 'created_time',
            created_time: {
              on_or_after: formatDate(subSeconds(new Date(), filter.value)),
            },
          }
        }
        if (field === 'last_edited_time') {
          return {
            timestamp: 'last_edited_time',
            last_edited_time: {
              on_or_after: formatDate(subSeconds(new Date(), filter.value)),
            },
          }
        }
        return {
          property: field,
          date: {
            on_or_after: formatDate(subSeconds(new Date(), filter.value)),
          },
        }
      case 'Equals':
        return {
          property: field,
          number: {
            equals: filter.value,
          },
        }
      case 'IsAnyOf':
        return {
          or: filter.value.map((value) => ({
            property: field,
            multi_select: {
              contains: value,
            },
          })),
        }
      case 'IsFalse':
        return {
          property: field,
          checkbox: {
            equals: false,
          },
        }
      case 'IsTrue':
        return {
          property: field,
          checkbox: {
            equals: true,
          },
        }
    }
  }
}
