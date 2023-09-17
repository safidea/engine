import { App } from '@entities/app/App'
import { Page } from '@entities/app/page/Page'
import { PageContext } from '@entities/app/page/PageContext'
import { PageParams } from '@entities/app/page/PageParams'
import { TableParams } from '@entities/app/table/TableParams'
import ReactDOMServer from 'react-dom/server'

export interface EngineData {
  page: PageParams
  tables: TableParams[]
  params: { [key: string]: string }
  uiDriver: string
}

export class PageController {
  constructor(private readonly app: App) {}

  async renderHtml(page: Page, context: PageContext): Promise<string> {
    const data: EngineData = {
      page: page.params,
      params: context.params,
      tables: this.app.tables.getAllParams(),
      uiDriver: this.app.pages.uiDriver,
    }
    const Page = await page.render(context)
    const html = ReactDOMServer.renderToString(<Page />)
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${page.title}</title>
          <script>
            window.__FOUNDATION_DATA__ = ${JSON.stringify(data)}
          </script>
          <link href="/output.css" rel="stylesheet">
        </head>
        <body>
          <div id="root">${html}</div>
          <script src="/bundle.js"></script>
        </body>
      </html>
    `
  }
}
