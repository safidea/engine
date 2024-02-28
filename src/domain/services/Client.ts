import type { Meta } from '@domain/engine/page/head/Meta'

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

export interface Spi {
  metas: Meta[]
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getLinkProps: () => { [key: string]: string }
}

export class Client {
  constructor(private spi: Spi) {}

  get metas() {
    return this.spi.metas
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

  getLinkProps = () => {
    return this.spi.getLinkProps()
  }
}
