import type { ReactComponents } from '@domain/entities/Component'
import type { Meta } from '@domain/entities/Head/Meta'

export interface BaseProps {
  navigation?: 'replace' | 'advance'
  frameId?: string | '_top' | '_self'
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

export interface ActionProps {
  reloadPageFrame?: boolean
  redirectPage?: boolean
}

export interface Spi {
  metas: Meta[]
  components: ReactComponents
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getActionProps: (options?: ActionProps) => { [key: string]: string }
  render: (component: JSX.Element) => string
}

export class Client {
  constructor(private _spi: Spi) {}

  get metas() {
    return this._spi.metas
  }

  get components() {
    return this._spi.components
  }

  renderToHtml = (component: JSX.Element): string => {
    return this._spi.render(component)
  }

  Frame = (props: FrameProps): JSX.Element => {
    return this._spi.Frame(props)
  }

  Stream = (props: StreamProps): JSX.Element => {
    return this._spi.Stream(props)
  }

  StreamSource = (props: StreamSourceProps): JSX.Element => {
    return this._spi.StreamSource(props)
  }

  getActionProps = (options?: ActionProps) => {
    return this._spi.getActionProps(options)
  }
}
