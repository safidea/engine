import type { Integration } from '@adapter/spi/integrations/NotionTableSpi'
import type { NotionTablePageProperties } from '@domain/integrations/NotionTable'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

export interface NotionTablePage {
  [key: string]: string | number | boolean
}

export class NotionTableIntegration implements Integration {
  constructor(
    private _notion: Client,
    private _database: PartialDatabaseObjectResponse
  ) {}

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
