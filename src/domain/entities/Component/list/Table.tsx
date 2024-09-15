import type { Server } from '@domain/services/Server'
import type { Base, BaseProps } from '../base'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { Html } from '@domain/entities/Response/Html'
import { ConfigError } from '@domain/entities/Error/Config'
import { Stream } from '@domain/entities/Response/Stream'
import type { Realtime } from '@domain/services/Realtime'
import type { Client } from '@domain/services/Client'
import { State } from '@domain/entities/Page/State'
import type { Get } from '@domain/entities/Request/Get'
import type { Table as TableEntity } from '@domain/entities/Table'

export interface Field {
  name: string
  label: string
}

export interface Row {
  [key: string]: string | number | boolean | undefined
}

export interface Props extends BaseProps {
  fields: Field[]
  rows: Row[]
}

export interface Config extends BaseProps {
  table: string
  fields: Field[]
}

export interface Services {
  server: Server
  client: Client
  idGenerator: IdGenerator
  realtime: Realtime
}

export interface Entities {
  tables: TableEntity[]
}

export class Table implements Base<Props> {
  private _props: Props
  private _table: TableEntity
  private _id: string
  private _frameId: string
  private _path: string
  private _streamPath: string

  constructor(
    config: Config,
    private _services: Services,
    entities: Entities
  ) {
    const { idGenerator } = _services
    const { table: tableName, id, ...props } = config
    this._id = id ?? idGenerator.forComponent()
    this._frameId = 'frame-' + this._id
    const table = entities.tables.find((table) => table.name === tableName)
    if (!table)
      throw new ConfigError({
        entity: 'Component',
        name: this._id,
        message: `Table "${tableName}" not found`,
      })
    this._table = table
    this._props = { ...props, id: this._id, rows: [] }
    this._path = `/api/component/table/${this._id}`
    this._streamPath = this._path + '/stream'
  }

  init = async () => {
    const { server } = this._services
    await Promise.all([
      server.get(this._path, this.getData),
      server.get(this._streamPath, this.streamData),
    ])
  }

  getData = async (request: Get) => {
    const state = new State(request)
    const { server } = this._services
    const { records } = await fetch(server.baseUrl + this._table.path).then((res) => res.json())
    return new Html(await this.html(state, { rows: records }))
  }

  streamData = async (request: Get) => {
    const state = new State(request)
    const { realtime, server } = this._services
    const stream = new Stream()
    const streamId = realtime.onInsert(this._table.name, async () => {
      const { records } = await fetch(server.baseUrl + this._table.path).then((res) => res.json())
      const htmlStream = await this.htmlStream(state, { rows: records })
      stream.sendEvent(htmlStream)
    })
    stream.onClose = () => realtime.removeListener(streamId)
    return stream
  }

  html = async (state: State, props?: Partial<Props>) => {
    const { client } = this._services
    const Component = await this.render(state)
    return client.renderToHtml(<Component {...this._props} {...props} />)
  }

  htmlStream = async (state: State, props?: Partial<Props>) => {
    const { client } = this._services
    const Component = await this.render(state)
    return client.renderToHtml(
      <client.Stream action="replace" target={this._id}>
        <Component {...this._props} {...props} />
      </client.Stream>
    )
  }

  render = async (_state: State) => {
    const { client } = this._services
    return (props?: Partial<Props>) => (
      <>
        <client.Frame id={this._frameId} src={this._path}>
          <client.components.Table {...this._props} {...props} />
        </client.Frame>
        <client.StreamSource src={this._streamPath} />
      </>
    )
  }

  validateConfig = () => {
    return []
  }
}
