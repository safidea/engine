import { IServerRepository, Route, Page } from '@domain/repositories/IServerRepository'
import express, { Express } from 'express'
import { Server as HTTPServer } from 'http'
import ReactDOMServer from 'react-dom/server'
import { getRootHtml } from '@infrastructure/client/root'

export class ExpressServer implements IServerRepository {
  private app: Express
  private server: HTTPServer | null

  constructor(private readonly port: number) {
    this.server = null
    this.app = express()
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
              params: req.params,
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
    await new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        resolve(true)
      })
    })
  }

  async stop() {
    await new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve(true)
        })
        this.server = null
      } else {
        resolve(true)
      }
    })
  }
}
