import type { Integration } from '@adapter/spi/integrations/NotionTableSpi'
import { Client } from '@notionhq/client'
import type {
  CreatePageParameters,
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

  create = async (page: NotionTablePage) => {
    const properties = this._preprocessProperties(page)
    const createdPage = await this._notion.pages.create({
      parent: {
        database_id: this._database.id,
      },
      properties,
    })
    return createdPage.id
  }

  _preprocessProperties = (page: NotionTablePage): CreatePageParameters['properties'] => {
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
}
