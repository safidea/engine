import type { Driver } from '@adapter/spi/ReactSpi'
import ReactDOMServer from 'react-dom/server'

export class ReactDriver implements Driver {
  render = (component: JSX.Element) => {
    return ReactDOMServer.renderToString(component)
  }
}
