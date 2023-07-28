import { IServerGateway, TableRoute, PageRoute } from '@domain/gateways/IServerGateway'
import express, { Express } from 'express'
import { Server as HTTPServer } from 'http'
import ReactDOMServer from 'react-dom/server'
import { Request, RequestQuery } from '@domain/entities/table/Request'
import path from 'path'
import fs from 'fs-extra'

export class ExpressServer implements IServerGateway {
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
            const { status = 200, json } = await route.handler(options)
            res.status(status).json(json)
          })
          break
        case 'POST':
          this.app.post(route.path, async (req, res) => {
            const { status = 200, json } = await route.handler({
              method: req.method,
              path: req.url,
              params: req.params,
              body: req.body,
            })
            res.status(status).json(json)
          })
          break
        case 'PATCH':
          this.app.patch(route.path, async (req, res) => {
            const { status = 200, json } = await route.handler({
              method: req.method,
              path: req.url,
              params: req.params,
              body: req.body,
            })
            res.status(status).json(json)
          })
          break
        case 'DELETE':
          this.app.delete(route.path, async (req, res) => {
            const { status = 200, json } = await route.handler({
              method: req.method,
              path: req.url,
              params: req.params,
            })
            res.status(status).json(json)
          })
          break
        default:
          break
      }
    })
  }

  async configurePages(routes: PageRoute[]) {
    this.app.get('/bundle.js', async (req, res) => {
      const bundle = await fs.readFile(path.resolve(process.cwd(), 'dist/bundle.js'), 'utf8')
      return res.send(bundle)
    })
    routes.forEach((route) => {
      this.app.get(route.path, async (req, res) => {
        const Page = await route.handler(req.url.split('?')[0])
        const pageHtml = ReactDOMServer.renderToString(Page)
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${route.title}</title>
            </head>
            <body>
              <div id="root">${pageHtml}</div>
              <script src="/bundle.js"></script>
            </body>
          </html>
        `
        res.send(html)
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
