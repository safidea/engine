import ReactDOMServer from 'react-dom/server'
import type { IUi } from '@domain/drivers/IUi'

export class ReactUi implements IUi {
  render(component: JSX.Element) {
    return ReactDOMServer.renderToString(component)
  }
}
