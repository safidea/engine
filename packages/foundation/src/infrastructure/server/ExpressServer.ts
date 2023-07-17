import { IServerRepository, Route, Page } from '@domain/repositories/IServerRepository'
import express from 'express'
import ReactDOMServer from 'react-dom/server'
import { getRootHtml } from '@infrastructure/client/root'

export class ExpressServer implements IServerRepository {
  private app: express.Application
  private port: number

  constructor() {
    this.app = express()
    this.port = Number(process.env.PORT ?? 3000)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  async configureRoutes(routes: Route[]) {
    routes.forEach((route) => {
      switch (route.method) {
        case 'GET':
          this.app.get(route.path, async (req, res) => {
            const json = await route.handler({
              method: req.method,
              path: req.url,
            })
            res.json(json)
          })
          break
        case 'POST':
          this.app.post(route.path, async (req, res) => {
            const json = await route.handler({
              method: req.method,
              path: req.url,
              params: req.params,
              body: req.body,
            })
            res.json(json)
          })
          break
        default:
          break
      }
    })
  }

  async configurePages(pages: Page[]) {
    pages.forEach((page) => {
      this.app.get(page.path, async (req, res) => {
        const Page = await page.handler(req.url)
        const html = ReactDOMServer.renderToString(Page)
        res.send(getRootHtml(html))
      })
    })
  }

  async start() {
    this.app.listen(this.port, () => {
      console.log(`Server is running at port ${this.port}`)
    })
  }
}
