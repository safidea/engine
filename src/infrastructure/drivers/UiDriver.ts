import type { Meta } from '@adapter/api/configs/page/head/Meta'
import type { Driver } from '@adapter/spi/UiSpi'
import type { FrameProps, StreamProps, StreamSourceProps } from '@domain/services/Ui'
import ReactDOMServer from 'react-dom/server'

export interface Client {
  Frame: (props: FrameProps) => JSX.Element
  Stream: (props: StreamProps) => JSX.Element
  StreamSource: (props: StreamSourceProps) => JSX.Element
  getLinkProps: () => { [key: string]: string }
  metas: Meta[]
}

export class UiDriver implements Driver {
  constructor(private client: Client) {}

  get metas() {
    return this.client.metas
  }

  render = (component: JSX.Element) => {
    return ReactDOMServer.renderToString(component)
  }

  Frame = (props: FrameProps) => {
    return this.client.Frame(props)
  }

  Stream = (props: StreamProps) => {
    return this.client.Stream(props)
  }

  StreamSource = (props: StreamSourceProps) => {
    return this.client.StreamSource(props)
  }

  getClientLinkProps = () => {
    return this.client.getLinkProps()
  }
}
