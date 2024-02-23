import { ContextMapper } from '@adapters/mappers/ContextMapper'
import { Page } from '@entities/app/page/Page'
import { hydrateRoot } from 'react-dom/client'

export class ClientController {
  constructor(readonly params: { [key: string]: string }) {}

  async hydrate(page: Page, container: HTMLElement): Promise<void> {
    const context = ContextMapper.toContext({ path: { params: this.params } })
    const Page = await page.render(context)
    hydrateRoot(container, <Page />)
  }
}
