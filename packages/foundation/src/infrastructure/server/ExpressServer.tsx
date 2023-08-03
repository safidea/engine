import React from 'react'
import { IServerGateway, TableRoute, PageRoute } from '@domain/gateways/IServerGateway'
import express, { Express } from 'express'
import { Server as HTTPServer } from 'http'
import ReactDOMServer from 'react-dom/server'
import { Request, RequestQuery } from '@domain/entities/table/Request'
import path from 'path'
import fs from 'fs-extra'
import debug from 'debug'
import { AppDto } from '@application/dtos/AppDto'
import { App } from '@domain/entities/App'
import { mapAppToDto } from '@application/mappers/AppMapper'

const log = debug('server:express')

export interface FoundationData {
  uiName: string
  fetcherName: string
  domain: string
  appDto: AppDto
  pagePath: string
  params: { [key: string]: string }
}

export class ExpressServer implements IServerGateway {
  private app: Express
  private server: HTTPServer | null

  constructor(
    private readonly port: number,
    private readonly uiName: string,
    private readonly fetcherName: string,
    private readonly domain: string
  ) {
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
          fetcherName: this.fetcherName,
          domain: this.domain,
          appDto: mapAppToDto(app),
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

  async start() {
    await new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        log(`Server listening on port ${this.port}`)
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
