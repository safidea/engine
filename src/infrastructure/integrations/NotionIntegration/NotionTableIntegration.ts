import type { FilterDto } from '@adapter/spi/dtos/FilterDto'
import type { Integration } from '@adapter/spi/integrations/NotionTableSpi'
import type { NotionTablePageProperties } from '@domain/integrations/NotionTable'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  PageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface NotionTablePage {
  [key: string]: string | number | boolean
}

export class NotionTableIntegration implements Integration {
  constructor(
    private _notion: Client,
    private _database: DatabaseObjectResponse
  ) {}

  get name() {
    return this._database.title.map((title) => title.plain_text).join('')
  }

  create = async (page: NotionTablePageProperties) => {
    const properties = this._preprocessProperties(page)
    const createdPage = await this._notion.pages.create({
      parent: {
        database_id: this._database.id,
      },
      properties,
    })
    return createdPage.id
  }

  createMany = async (pages: NotionTablePageProperties[]) => {
    const ids: string[] = []
    for (const page of pages) {
      const id = await this.create(page)
      ids.push(id)
    }
    return ids
  }

  retrieve = async (id: string) => {
    const page = await this._notion.pages.retrieve({
      page_id: id,
    })
    if (!('properties' in page)) {
      throw new Error('Page does not have properties')
    }
    const properties = this._postprocessProperties(page.properties)
    return {
      id: page.id,
      properties,
    }
  }

  archive = async (id: string) => {
    await this._notion.pages.update({
      page_id: id,
      archived: true,
    })
  }

  list = async (_filters: FilterDto[] = []) => {
    const pages = await this._notion.databases.query({
      database_id: this._database.id,
    })
    return pages.results.map((page) => {
      if (page.object !== 'page') {
        throw new Error('Not a page')
      }
      if (!('properties' in page)) {
        throw new Error('Page does not have properties')
      }
      const properties = this._postprocessProperties(page.properties)
      return {
        id: page.id,
        properties,
      }
    })
  }

  _preprocessProperties = (page: NotionTablePageProperties): CreatePageParameters['properties'] => {
    const properties: CreatePageParameters['properties'] = {}
    for (const key in page) {
      const property = this._database.properties[key]
      if (property) {
        switch (property.type) {
          case 'title':
            properties[key] = {
              type: 'title',
              title: [
                {
                  text: {
                    content: String(page[key]),
                  },
                },
              ],
            }
            break
        }
      }
    }
    return properties
  }

  _postprocessProperties = (page: PageObjectResponse['properties']): NotionTablePageProperties => {
    const properties: NotionTablePageProperties = {}
    for (const key in page) {
      const property = page[key]
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
    return properties
  }
}
