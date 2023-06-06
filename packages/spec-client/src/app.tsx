import '@testing-library/jest-dom'
import MockAxios from '../__mocks__/axios'
import ResizeObserver from 'resize-observer-polyfill'
import userEvent from '@testing-library/user-event'
import { PageService } from 'client-page'
import { DatabaseDataType } from 'shared-database'

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

  public seed(table: string, data: DatabaseDataType[]) {
    MockAxios.post(`/api/table/${table}`, data)
  }
}

export default App
