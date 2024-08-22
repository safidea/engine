import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { React } from '@domain/services/React'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { Html } from '@domain/entities/Response/Html'
import { ConfigError } from '@domain/entities/Error/Config'
import { Stream } from '@domain/entities/Response/Stream'
import type { Realtime } from '@domain/services/Realtime'
import type { Button } from '../base/Button'
import type { Client } from '@domain/services/Client'
import type { Title } from '../content/Title'
import type { Props as TitleProps } from '../content/Title'
import type { Props as ButtonProps } from '../base/Button'
import { State } from '@domain/entities/Page/State'
import type { Get } from '@domain/entities/Request/Get'

export interface Column {
  name: string
  label: string
}

export interface Row {
  [key: string]: string | number | boolean | undefined
}

export interface Props extends BaseProps {
  columns: Column[]
  rows: Row[]
  Title?: React.FC<Partial<TitleProps>>
  Buttons?: React.FC<Partial<ButtonProps>>[]
}

interface Params extends BaseProps {
  source: string
  title?: Title
  columns: Column[]
  buttons?: Button[]
  Component: ReactComponent<Props>
  server: Server
  react: React
  client: Client
  idGenerator: IdGenerator
  realtime?: Realtime
}

export class Table implements Base<Props> {
  private id: string
  private path: string
  private stream?: {
    path: string
    table: string
  }

  constructor(private _params: Params) {
    const { source, idGenerator } = _params
    this.id = idGenerator.forComponent()
    this.path = `/api/component/table/${this.id}`
    if (source.startsWith('/api/table/')) {
      this.stream = {
        path: this.path + '/stream',
        table: source.replace('/api/table/', ''),
      }
    }
  }

  init = async () => {
    const { server, buttons = [], title } = this._params
    await Promise.all([
      server.get(this.path, this.getData),
      this.stream ? server.get(this.stream.path, this.streamData) : undefined,
      ...buttons.map((button) => button.init()),
      title?.init(),
    ])
  }

  getData = async (request: Get) => {
    const state = new State(request)
    const { source, server } = this._params
    const url = this.stream ? server.baseUrl + source : source
    const result = await fetch(url).then((res) => res.json())
    if (this.stream) {
      const { records } = result
      return new Html(await this.html(state, { rows: records }))
    }
    return new Html(await this.html(state, { rows: result }))
  }

  streamData = async (request: Get) => {
    const state = new State(request)
    const { realtime, source, server } = this._params
    const stream = new Stream()
    if (!realtime) throw new Error('Realtime service is not available')
    if (!this.stream) throw new Error('Stream is not available')
    const id = realtime.onInsert(this.stream.table, async () => {
      const { records } = await fetch(server.baseUrl + source).then((res) => res.json())
      const htmlStream = await this.htmlStream(state, { rows: records })
      stream.sendEvent(htmlStream)
    })
    stream.onClose = () => realtime.removeListener(id)
    return stream
  }

  html = async (state: State, props?: Partial<Props>) => {
    const { react, id, className } = this._params
    const Component = await this.render(state, { withSource: false })
    return react.renderToHtml(<Component {...props} id={id} className={className} />)
  }

  htmlStream = async (state: State, props?: Partial<Props>) => {
    const { react, client, title, columns, buttons = [], id, className } = this._params
    const Component = await this.render(state, { withSource: false })
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Title = title ? await title.render() : undefined
    return react.renderToHtml(
      <client.Stream action="replace" target={this.id}>
        <Component {...{ id, className, Title, columns, Buttons, ...props }} />
      </client.Stream>
    )
  }

  render = async (state: State, options?: { withSource: boolean }) => {
    const { withSource = true } = options || {}
    const { client, Component, title, columns, buttons = [] } = this._params
    const Buttons = await Promise.all(buttons.map((button) => button.render(state)))
    const Title = title ? await title.render() : undefined
    return (props?: Partial<Props>) => (
      <>
        <client.Frame id={this.id} src={withSource ? this.path : ''}>
          <Component {...{ Title, columns, Buttons, rows: [], ...props }} />
        </client.Frame>
        {this.stream ? <client.StreamSource src={this.stream.path} /> : null}
      </>
    )
  }

  validateConfig = () => {
    const { source, buttons, server, title } = this._params
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
    if (buttons) {
      buttons.forEach((button) => {
        errors.push(...button.validateConfig())
      })
    }
    if (title) {
      errors.push(...title.validateConfig())
    }
    return errors
  }
}
