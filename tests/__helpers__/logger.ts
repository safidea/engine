import { Client } from '@elastic/elasticsearch'
import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger, type Config } from '@domain/services/Logger'
import { LoggerDriver } from '@infrastructure/drivers/LoggerDriver'

export default class extends Logger {
  constructor() {
    const config: Config = { driver: 'Console', level: 'error' }
    super(new LoggerSpi(new LoggerDriver(config)), config)
  }
}

export type Hit = { _source: { message: string } }

class ElasticSearch {
  private _client: Client
  url = process.env.TEST_ELASTICSEARCH_URL!
  index = process.env.TEST_ELASTICSEARCH_INDEX!

  constructor() {
    if (!this.url || !this.index) {
      throw new Error('Missing ElasticSearch test environment variables')
    }
    this._client = new Client({
      node: this.url,
      ssl: { rejectUnauthorized: false },
    })
  }

  search = async (message: string): Promise<Hit[]> => {
    const { body } = await this._client.search({
      index: this.index,
      body: {
        query: {
          match: { message },
        },
      },
    })
    return body.hits.hits as Hit[]
  }

  checkIndex = async (index: string): Promise<boolean> => {
    const { body } = await this._client.indices.exists({ index })
    return !!body
  }

  deleteIndex = async (index: string) => {
    await this._client.indices.delete({ index })
  }
}

export const elasticSearch = new ElasticSearch()
