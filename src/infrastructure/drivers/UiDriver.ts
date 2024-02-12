import type { Meta } from '@adapter/api/configs/page/head/Meta'
import type { Driver } from '@adapter/spi/UiSpi'
import type { FrameProps } from '@domain/services/Ui'
import ReactDOMServer from 'react-dom/server'

export interface Client {
  Frame: (props: FrameProps) => JSX.Element
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
}
