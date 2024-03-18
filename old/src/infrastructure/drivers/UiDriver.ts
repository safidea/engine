import type { Driver } from '@adapter/spi/UiSpi'
import ReactDOMServer from 'react-dom/server'

export class UiDriver implements Driver {
  constructor() {}

  render = (component: JSX.Element) => {
    return ReactDOMServer.renderToString(component)
  }
}
