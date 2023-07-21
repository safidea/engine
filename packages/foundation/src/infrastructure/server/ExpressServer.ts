import { IServerRepository, TableRoute, PageRoute } from '@domain/repositories/IServerRepository'
import express, { Express } from 'express'
import { Server as HTTPServer } from 'http'
import ReactDOMServer from 'react-dom/server'
import { getRootHtml } from '@infrastructure/client/root'
import { Request, RequestQuery } from '@domain/entities/Request'

export class ExpressServer implements IServerRepository {
  private app: Express
  private server: HTTPServer | null

  constructor(private readonly port: number) {
    this.server = null
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  async configureTables(routes: TableRoute[]) {
    routes.forEach((route) => {
      switch (route.method) {
        case 'GET':
          this.app.get(route.path, async (req, res) => {
            const options: Request = {
              method: req.method,
              path: req.url.split('?')[0],
              params: req.params,
            }
            if (req.query) {
              options.query = Object.keys(req.query).reduce((acc: RequestQuery, key: string) => {
                acc[key] = String(req.query[key])
                return acc
              }, {})
            }
            const json = await route.handler(options)
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

  async configurePages(routes: PageRoute[]) {
    routes.forEach((route) => {
      this.app.get(route.path, async (req, res) => {
        const Page = await route.handler(req.url.split('?')[0])
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
