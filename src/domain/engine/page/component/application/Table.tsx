import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Get } from '@domain/entities/request/Get'
import { Html } from '@domain/entities/response/Html'
import type { Props as ButtonProps } from '../base/Button'
import { ConfigError } from '@domain/entities/error/Config'
import { Stream } from '@domain/entities/response/Stream'
import type { Realtime } from '@domain/services/Realtime'

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
  addButton?: ButtonProps
}

interface Params {
  props: Omit<Props, 'rows'> & { source: string }
  component: ReactComponent<Props>
  server: Server
  ui: Ui
  idGenerator: IdGenerator
  realtime?: Realtime
}

export class Table implements Base<Props> {
  private id: string
  private path: string
  private props: Props
  private stream?: {
    path: string
    table: string
  }

  constructor(private params: Params) {
    const { props, idGenerator } = params
    this.props = { ...props, rows: [] }
    this.id = idGenerator.forForm()
    this.path = `/api/component/table/${this.id}`
    if (props.source.startsWith('/api/table/')) {
      this.stream = {
        path: this.path + '/stream',
        table: props.source.replace('/api/table/', ''),
      }
    }
  }

  init = async () => {
    const { server } = this.params
    await server.get(this.path, this.getData)
    if (this.stream) await server.get(this.stream.path, this.streamData)
  }

  getData = async (request: Get) => {
    const { source } = this.params.props
    const url = this.stream ? request.baseUrl + source : source
    const result = await fetch(url).then((res) => res.json())
    if (this.stream) {
      const { records } = result
      return new Html(await this.html({ rows: records }))
    }
    return new Html(await this.html({ rows: result }))
  }

  streamData = async (request: Get) => {
    const {
      realtime,
      props: { source },
    } = this.params
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
    const { ui } = this.params
    const Component = await this.render({ withSource: false })
    return ui.renderToHtml(
      <ui.Stream action="replace" target={this.id}>
        <Component {...{ ...this.props, ...props }} />
      </ui.Stream>
    )
  }

  render = async (options?: { withSource: boolean }) => {
    const { withSource = true } = options || {}
    const { ui, component: Component } = this.params
    return (props?: Partial<Props>) => (
      <>
        <ui.Frame id={this.id} src={withSource ? this.path : ''}>
          <Component {...{ ...this.props, ...props }} />
        </ui.Frame>
        {this.stream ? <ui.StreamSource src={this.stream.path} /> : null}
      </>
    )
  }

  validateConfig = () => {
    const {
      props: { source },
      server,
    } = this.params
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
