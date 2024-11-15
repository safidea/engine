import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, BaseServices } from '../base'
import type { IdGenerator } from '@domain/services/IdGenerator'
import { HtmlResponse } from '@domain/entities/Response/Html'
import { ConfigError } from '@domain/entities/Error/Config'
import { StreamResponse } from '@domain/entities/Response/Stream'
import type { Realtime } from '@domain/services/Realtime'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import { PageState } from '@domain/entities/Page/State'
import type { GetRequest } from '@domain/entities/Request/Get'

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
  actionClientProps?: { [key: string]: string }
}

export interface Config extends BaseProps {
  source: string
  open: string
  columns: Column[]
}

export interface Services extends BaseServices {
  server: Server
  idGenerator: IdGenerator
  realtime?: Realtime
  templateCompiler: TemplateCompiler
}

export class List implements Base<Props> {
  private id: string
  private path: string
  private stream?: {
    path: string
    table: string
  }
  private open: Template

  constructor(
    private _config: Config,
    private _services: Services
  ) {
    const { source, open } = _config
    const { idGenerator, templateCompiler } = _services
    this.id = idGenerator.forComponent()
    this.path = `/api/component/list/${this.id}`
    this.open = templateCompiler.compile(open)
    if (source.startsWith('/api/table/')) {
      this.stream = {
        path: this.path + '/stream',
        table: source.replace('/api/table/', ''),
      }
    }
  }

  init = async () => {
    const { server } = this._services
    await Promise.all([
      server.get(this.path, this.getData),
      this.stream ? server.get(this.stream.path, this.streamData) : undefined,
    ])
  }

  getRows = (rows: Row['data'][]): Row[] =>
    rows.map((record: Row['data']) => ({
      data: record,
      open: this.open.fillAsString({ row: record }),
    }))

  getData = async (request: GetRequest) => {
    const state = new PageState(request)
    const { server } = this._services
    const { source } = this._config
    const url = this.stream ? server.baseUrl + source : source
    const result = await fetch(url).then((res) => res.json())
    if (this.stream) {
      const { records } = result
      return new HtmlResponse(await this.html(state, { rows: this.getRows(records) }))
    }
    return new HtmlResponse(await this.html(state, { rows: this.getRows(result) }))
  }

  streamData = async (request: GetRequest) => {
    const state = new PageState(request)
    const { realtime, server } = this._services
    const { source } = this._config
    const stream = new StreamResponse()
    if (!realtime) throw new Error('Realtime service is not available')
    if (!this.stream) throw new Error('Stream is not available')
    const id = realtime.onInsert(this.stream.table, async () => {
      const { records } = await fetch(server.baseUrl + source).then((res) => res.json())
      const htmlStream = await this.htmlStream(state, { rows: this.getRows(records) })
      stream.sendEvent(htmlStream)
    })
    stream.onClose = () => realtime.removeListener(id)
    return stream
  }

  html = async (state: PageState, props?: Partial<Props>) => {
    const { client } = this._services
    const Component = await this.render(state, { withSource: false })
    const actionClientProps = client.getActionProps({ reloadPageFrame: true })
    return client.renderToHtml(<Component {...props} actionClientProps={actionClientProps} />)
  }

  htmlStream = async (state: PageState, props?: Partial<Props>) => {
    const { id, className, columns } = this._config
    const { client } = this._services
    const Component = await this.render(state, { withSource: false })
    const actionClientProps = client.getActionProps({ reloadPageFrame: true })
    return client.renderToHtml(
      <client.Stream action="replace" target={this.id}>
        <Component {...{ id, className, columns, ...props, actionClientProps }} />
      </client.Stream>
    )
  }

  render = async (state: PageState, options?: { withSource: boolean }) => {
    const { withSource = true } = options || {}
    const { client } = this._services
    const { ...defaultProps } = this._config
    const Component = client.components.List
    return (props?: Partial<Props>) => (
      <>
        <client.Frame id={this.id} src={withSource ? this.path : ''}>
          <Component {...{ ...defaultProps, rows: [], ...props }} />
        </client.Frame>
        {this.stream ? <client.StreamSource src={this.stream.path} /> : null}
      </>
    )
  }

  validateConfig = () => {
    const { server } = this._services
    const { source } = this._config
    const errors = []
    if (source.startsWith('/api/table/')) {
      if (!server.hasGetHandler(source)) {
        errors.push(
          new ConfigError({
            entity: 'Component',
            name: this.id,
            message: `Table source ${source} does not have a GET handler`,
          })
        )
      }
    } else {
      errors.push(
        new ConfigError({
          entity: 'Component',
          name: this.id,
          message: 'Table source must start with /api/table/',
        })
      )
    }
    return errors
  }
}
