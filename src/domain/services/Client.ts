import type { ReactComponents } from '@domain/entities/Component'
import type { HeadMeta } from '@domain/entities/Head/Meta'

export interface ClientBaseProps {
  navigation?: 'replace' | 'advance'
  frameId?: string | '_top' | '_self'
}

export interface ClientFrameProps extends ClientBaseProps {
  id: string
  src?: string
  children?: React.ReactNode
}

export interface ClientStreamProps {
  action: 'append' | 'prepend' | 'replace' | 'update' | 'remove' | 'before' | 'after'
  target: string
  children: React.ReactNode
}

export interface ClientStreamSourceProps {
  src: string
}

export interface ClientActionProps {
  reloadPageFrame?: boolean
  redirectPage?: boolean
}

export interface IClientSpi {
  metas: HeadMeta[]
  components: ReactComponents
  Frame: (props: ClientFrameProps) => JSX.Element
  Stream: (props: ClientStreamProps) => JSX.Element
  StreamSource: (props: ClientStreamSourceProps) => JSX.Element
  getActionProps: (options?: ClientActionProps) => { [key: string]: string }
  render: (component: JSX.Element) => string
}

export class Client {
  constructor(private _spi: IClientSpi) {}

  get metas() {
    return this._spi.metas
  }

  get components() {
    return this._spi.components
  }

  renderToHtml = (component: JSX.Element): string => {
    return this._spi.render(component)
  }

  Frame = (props: ClientFrameProps): JSX.Element => {
    return this._spi.Frame(props)
  }

  Stream = (props: ClientStreamProps): JSX.Element => {
    return this._spi.Stream(props)
  }

  StreamSource = (props: ClientStreamSourceProps): JSX.Element => {
    return this._spi.StreamSource(props)
  }

  getActionProps = (options?: ClientActionProps) => {
    return this._spi.getActionProps(options)
  }
}
