import type { UIDriver } from '@adapter/spi/UISPI'
import ReactDOMServer from 'react-dom/server'

export class ReactUIDriver implements UIDriver {
  render(component: JSX.Element) {
    return ReactDOMServer.renderToString(component)
  }
}
