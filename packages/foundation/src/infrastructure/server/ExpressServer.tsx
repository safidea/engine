import React from 'react'
import net from 'net'
import { Server, ApiRoute, PageRoute } from '@adapter/spi/server/Server'
import express, { Express } from 'express'
import { Server as HTTPServer } from 'http'
import ReactDOMServer from 'react-dom/server'
import path from 'path'
import fs from 'fs-extra'
import debug from 'debug'
import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { App } from '@domain/entities/app/App'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { RequestDto, RequestQueryDto } from '@adapter/spi/server/dtos/RequestDto'
import { Fetcher } from '@adapter/spi/fetcher/Fetcher'

const log = debug('server:express')

export interface FoundationData {
  uiName: string
  fetcherName: string
  url: string
  appDto: AppDto
  pagePath: string
  params: { [key: string]: string }
}

export class ExpressServer implements Server {
  private app: Express
  private server: HTTPServer | null

  constructor(
    private readonly uiName: string,
    private readonly fetcher: Fetcher,
    private url?: string,
    private port?: number
  ) {
    this.server = null
    this.app = express()
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  async configureTables(routes: ApiRoute[]) {
    routes.forEach((route) => {
      switch (route.method) {
        case 'GET':
          this.app.get(route.path, async (req, res) => {
            const options: RequestDto = {
              method: req.method,
              path: req.url.split('?')[0],
              params: req.params,
            }
            if (req.query) {
              options.query = Object.keys(req.query).reduce((acc: RequestQueryDto, key: string) => {
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

  async configurePages(routes: PageRoute[], app: App) {
    this.app.get('/bundle.js', async (req, res) => {
      const bundle = await fs.readFile(path.resolve(__dirname, '../../../bundle.js'), 'utf8')
      return res.send(bundle)
    })
    routes.forEach((route) => {
      this.app.get(route.path, async (req, res) => {
        const Page = await route.handler({ path: req.url.split('?')[0], params: req.params })
        const pageHtml = ReactDOMServer.renderToString(<Page />)
        const data: FoundationData = {
          uiName: this.uiName,
          fetcherName: this.fetcher.name,
          url: this.url || '',
          appDto: AppMapper.toDto(app),
          pagePath: route.path,
          params: req.params,
        }
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${route.title}</title>
              <script>
                window.__FOUNDATION_DATA__ = ${JSON.stringify(data)}
              </script>
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

  async findAvailablePort(): Promise<number> {
    if (this.port) return this.port
    return new Promise<number>((resolve, reject) => {
      const server = net.createServer()
      server.unref()
      server.on('error', reject)
      server.listen(0, () => {
        const { port } = server.address() as net.AddressInfo
        resolve(port)
        server.close()
      })
    })
  }

  async start() {
    this.port = await this.findAvailablePort()
    await new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        log(`Server listening on port ${this.port}`)
        resolve(true)
      })
    })
    if (!this.fetcher.url || this.url !== this.fetcher.url) {
      if (!this.url) this.url = 'http://localhost:' + this.port
      this.fetcher.setUrl(this.url)
    }
    return { port: this.port, url: this.url }
  }

  async stop() {
    await new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close(() => {
          resolve(true)
        })
        this.server = null
      } else {
        reject('Server not started')
      }
    })
  }
}
