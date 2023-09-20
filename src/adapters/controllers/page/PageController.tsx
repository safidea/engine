import React from 'react'
import { App } from '@entities/app/App'
import { Page } from '@entities/app/page/Page'
import { Context } from '@entities/app/page/context/Context'
import ReactDOMServer from 'react-dom/server'
import { IServerData } from '../server/IServerData'

export class PageController {
  constructor(private readonly app: App) {}

  async renderHtml(page: Page, context: Context): Promise<string> {
    const data: IServerData = {
      page: page.params,
      params: context.path.params,
      tables: this.app.tables.getAllParams(),
      uiDriver: this.app.pages.ui.driverName,
    }
    const Page = await page.render(context)
    const html = ReactDOMServer.renderToString(<Page />)
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${page.title}</title>
          <script>
            window.__ENGINE_DATA__ = ${JSON.stringify(data)}
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
