import type { Meta } from '@domain/engine/page/head/Meta'

export type FrameId = string | 'page' | 'self'
export type Navigation = 'replace' | 'advance'
export type Method = 'GET' | 'POST' | 'PUT' | 'PUT' | 'DELETE'

export interface BaseProps {
  navigation?: Navigation
  frameId?: FrameId
}

export interface FrameProps extends BaseProps {
  id: string
  src?: string
  children?: React.ReactNode
}

export interface StreamProps {
  action: 'append' | 'prepend' | 'replace' | 'update' | 'remove' | 'before' | 'after'
  target: string
  children: React.ReactNode
}

export interface StreamSourceProps {
  src: string
}

export interface Spi {
  metas: Meta[]
  render: (component: JSX.Element) => string
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
}

export class Ui {
  constructor(private spi: Spi) {}

  get metas() {
    return this.spi.metas
  }

  renderToHtml = (component: JSX.Element): string => {
    const html = this.spi.render(component)
    return html.replace(/<!--.*?-->/gs, '')
  }

  Frame = (props: FrameProps): JSX.Element => {
    return this.spi.Frame(props)
  }

  Stream = (props: StreamProps): JSX.Element => {
    return this.spi.Stream(props)
  }

  StreamSource = (props: StreamSourceProps): JSX.Element => {
    return this.spi.StreamSource(props)
  }
}
