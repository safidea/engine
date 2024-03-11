import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Get } from '@domain/entities/request/Get'
import { Html } from '@domain/entities/response/Html'
import { ConfigError } from '@domain/entities/error/Config'
import { Stream } from '@domain/entities/response/Stream'
import type { Realtime } from '@domain/services/Realtime'
import type { Client } from '@domain/services/Client'

export interface Column {
  name: string
}

export interface Row {
  data: {
    [key: string]: string | number | boolean | undefined
  }
  open: string
}

export interface Props extends BaseProps {
  columns: Column[]
  rows: Row[]
}

interface Params {
  source: string
  columns: Column[]
  open: string
  Component: ReactComponent<Props>
  server: Server
  ui: Ui
  client: Client
  idGenerator: IdGenerator
  realtime?: Realtime
}

export class List implements Base<Props> {
  private id: string
  private path: string
  private stream?: {
    path: string
    table: string
  }

  constructor(private params: Params) {
    const { source, idGenerator } = params
    this.id = idGenerator.forForm()
    this.path = `/api/component/list/${this.id}`
    if (source.startsWith('/api/table/')) {
      this.stream = {
        path: this.path + '/stream',
        table: source.replace('/api/table/', ''),
      }
    }
  }

  init = async () => {
    const { server } = this.params
    await Promise.all([
      server.get(this.path, this.getData),
      this.stream ? server.get(this.stream.path, this.streamData) : undefined,
    ])
  }

  getData = async (request: Get) => {
    const { source } = this.params
    const url = this.stream ? request.baseUrl + source : source
    const result = await fetch(url).then((res) => res.json())
    if (this.stream) {
      const { records } = result
      return new Html(await this.html({ rows: records }))
    }
    return new Html(await this.html({ rows: result }))
  }

  streamData = async (request: Get) => {
    const { realtime, source } = this.params
    const stream = new Stream()
    if (!realtime) throw new Error('Realtime service is not available')
    if (!this.stream) throw new Error('Stream is not available')
    const id = realtime.onInsert(this.stream.table, async () => {
      const { records } = await fetch(request.baseUrl + source).then((res) => res.json())
      const htmlStream = await this.htmlStream({ rows: records })
      stream.sendEvent(htmlStream)
    })
    stream.onClose = () => realtime.removeListener(id)
    return stream
  }

  html = async (props?: Partial<Props>) => {
    const { ui } = this.params
    const Component = await this.render({ withSource: false })
    return ui.renderToHtml(<Component {...props} />)
  }

  htmlStream = async (props?: Partial<Props>) => {
    const { ui, client, columns } = this.params
    const Component = await this.render({ withSource: false })
    return ui.renderToHtml(
      <client.Stream action="replace" target={this.id}>
        <Component {...{ columns, ...props }} />
      </client.Stream>
    )
  }

  render = async (options?: { withSource: boolean }) => {
    const { withSource = true } = options || {}
    const { client, Component, columns } = this.params
    return (props?: Partial<Props>) => (
      <>
        <client.Frame id={this.id} src={withSource ? this.path : ''}>
          <Component {...{ columns, rows: [], ...props }} />
        </client.Frame>
        {this.stream ? <client.StreamSource src={this.stream.path} /> : null}
      </>
    )
  }

  validateConfig = () => {
    const { source, server } = this.params
    const errors = []
    if (source.startsWith('/api/table/')) {
      if (!server.hasGetHandler(source)) {
        errors.push(
          new ConfigError({ message: `Table source ${source} does not have a GET handler` })
        )
      }
    } else {
      errors.push(new ConfigError({ message: 'Table source must start with /api/table/' }))
    }
    return errors
  }
}
