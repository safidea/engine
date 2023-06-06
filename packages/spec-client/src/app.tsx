import '@testing-library/jest-dom'
import ResizeObserver from 'resize-observer-polyfill'
import userEvent from '@testing-library/user-event'
import { PageService } from 'client-page'

import type { ConfigSchemaInterface } from 'server-common'

global.ResizeObserver = ResizeObserver

interface AppInterface {
  config: ConfigSchemaInterface
}

class App {
  private config: ConfigSchemaInterface
  public user = userEvent.setup()

  constructor({ config }: AppInterface) {
    this.config = config
  }

  public page(path: string) {
    const pages = this.config.pages
    if (!pages || !pages[path]) throw new Error(`Page ${path} not found`)
    const components = pages[path].components
    const Page = PageService.render(components)
    return <Page />
  }
}

export default App
