import '@testing-library/jest-dom'
import axios from 'axios'
import ResizeObserver from 'resize-observer-polyfill'
import userEvent from '@testing-library/user-event'
import { PageService } from 'client-page'
import { DatabaseDataType } from 'shared-database'
import { SWRConfig } from 'swr'

import type { ConfigInterface } from 'shared-app'

global.ResizeObserver = ResizeObserver

// Axios is automocked by Jest

jest.mock('server-database/prisma/client', () => {
  return jest.requireActual('../__mocks__/prisma/client')
})

interface AppInterface {
  config: ConfigInterface
}

class App {
  private config: ConfigInterface
  public user = userEvent.setup()

  constructor({ config }: AppInterface) {
    this.config = config
  }

  public page(path: string) {
    const pages = this.config.pages
    if (!pages || !pages[path]) throw new Error(`Page ${path} not found`)
    const components = pages[path].components
    const Page = PageService.render(components, this.config)
    return (
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Page />
      </SWRConfig>
    )
  }

  public async seed(table: string, data: DatabaseDataType[]) {
    await axios.post(`/api/table/${table}`, data)
  }
}

export default App
