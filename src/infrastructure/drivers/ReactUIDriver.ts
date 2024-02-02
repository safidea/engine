import type { UiDriver } from '@adapter/spi/UiSpi'
import ReactDOMServer from 'react-dom/server'

export class ReactUiDriver implements UiDriver {
  render(component: JSX.Element) {
    return ReactDOMServer.renderToString(component)
  }
}
