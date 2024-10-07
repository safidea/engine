import type { ElasticSearchConfig } from '@domain/services/Logger'
import { createLogger, format, transports } from 'winston'
import { Client } from '@elastic/elasticsearch'
import { ElasticsearchTransport } from 'winston-elasticsearch'
import { BaseDriver } from './base'

export class ElasticsSearchDriver extends BaseDriver {
  private _client: Client

  constructor(private _config: ElasticSearchConfig) {
    const { level, url, index, silent } = _config
    const client = new Client({
      node: url,
      ssl: { rejectUnauthorized: false },
    })
    const esTransportOpts = {
      level,
      client,
      index,
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const esTransport = new ElasticsearchTransport(esTransportOpts)
    esTransport.on('error', (error) => {
      console.error('Error in esTransport caught', error)
    })

    const esTransports = []
    esTransports.push(esTransport)
    if (!silent) esTransports.push(new transports.Console())

    const logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: esTransports,
    })
    super(logger)
    this._client = client
  }

  init = async () => {
    const { index } = this._config
    const exists = await this._client.indices.exists({ index })
    if (exists.body) return
    await this._client.indices.create({ index })
  }
}
