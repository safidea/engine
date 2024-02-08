import type { Driver } from '@adapter/spi/UiSpi'
import type { FrameProps } from '@domain/services/Ui'
import ReactDOMServer from 'react-dom/server'

export interface Client {
  Frame: (props: FrameProps) => JSX.Element
}

export class UiDriver implements Driver {
  constructor(private client: Client) {}

  render = (component: JSX.Element) => {
    return ReactDOMServer.renderToString(component)
  }

  Frame = (props: FrameProps) => {
    return this.client.Frame(props)
  }
}
