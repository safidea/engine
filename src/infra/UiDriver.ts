import ReactDOMServer from 'react-dom/server'
import type { IUiDriver } from 'src_OLD/services/ui/IUiDriver'

export class UiDriver implements IUiDriver {
  render(component: JSX.Element) {
    return ReactDOMServer.renderToString(component)
  }
}
