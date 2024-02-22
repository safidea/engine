import type { Server } from '@domain/services/Server'
import type { Base, BaseProps, ReactComponent } from '../base/base'
import type { Ui } from '@domain/services/Ui'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Get } from '@domain/entities/request/Get'
import { Html } from '@domain/entities/response/Html'

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
}

interface Params {
  props: Omit<Props, 'rows'> & { source: string }
  component: ReactComponent<Props>
  server: Server
  ui: Ui
  idGenerator: IdGenerator
}

export class Table implements Base<Props> {
  private id: string
  private path = '#'
  private props: Props

  constructor(private params: Params) {
    const { props, idGenerator, server } = params
    this.props = { ...props, rows: [] }
    this.id = idGenerator.forForm()
    this.path = `/api/component/table/${this.id}`
    server.get(this.path, this.get)
  }

  get = async (request: Get) => {
    const { source } = this.params.props
    const url = source.startsWith('/') ? request.baseUrl + source : source
    const result = await fetch(url).then((res) => res.json())
    if (source.startsWith('/api/table/')) {
      const { records } = result
      return new Html(await this.html({ rows: records }))
    }
    return new Html(await this.html({ rows: result }))
  }

  html = async (props?: Partial<Props>) => {
    const { ui } = this.params
    const Component = await this.render({ withSource: false })
    return ui.renderToHtml(<Component {...props} />)
  }

  render = async (options?: { withSource: boolean }) => {
    const { withSource = true } = options || {}
    const { ui, component: Component } = this.params
    return (props?: Partial<Props>) => (
      <ui.Frame id={`table-${this.id}`} src={withSource ? this.path : ''}>
        <Component {...{ ...this.props, ...props }} />
      </ui.Frame>
    )
  }
}
