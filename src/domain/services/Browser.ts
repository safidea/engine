import { BrowserPage, type Spi as BrowserPageSpi } from './BrowserPage'
import type { IdGenerator } from './IdGenerator'

export interface Services {
  idGenerator: IdGenerator
}

export interface Spi {
  launch: (id: string) => Promise<void>
  newPage: (id: string, baseUrl: string) => Promise<BrowserPageSpi>
  close: (id: string) => Promise<void>
}

export class Browser {
  constructor(
    private spi: Spi,
    private services: Services
  ) {}

  launch = async () => {
    const { idGenerator } = this.services
    const id = idGenerator.forBrowser()
    await this.spi.launch(id)
    return id
  }

  newPage = async (id: string, baseUrl: string) => {
    const page = await this.spi.newPage(id, baseUrl)
    return new BrowserPage(page)
  }

  close = async (id: string) => {
    await this.spi.close(id)
  }
}
