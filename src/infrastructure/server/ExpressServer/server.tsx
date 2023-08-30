import React from 'react'
import { IServerAdapter, ApiRoute, PageRoute } from '@adapter/spi/server/IServerAdapter'
import express, { Express } from 'express'
import { Server } from 'http'
import ReactDOMServer from 'react-dom/server'
import path from 'path'
import fs from 'fs-extra'
import { App } from '@domain/entities/app/App'
import { RequestDto, RequestQueryDto } from '@adapter/spi/server/dtos/RequestDto'
import { PageMapper } from '@adapter/api/page/mappers/PageMapper'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
import { TableDto } from '@adapter/api/table/dtos/TableDto'
import { PageDto } from '@adapter/api/page/dtos/PageDto'

export interface FoundationData {
  page: PageDto
  tables: TableDto[]
  params: { [key: string]: string }
  adapters: {
    uiName: string
  }
}

export class ExpressServer implements IServerAdapter {
  private express?: Express
  private app?: App
  private server?: Server

  constructor(
    private _port: number,
    private _uiName: string
  ) {}

  initConfig(app: App) {
    this.express = express()
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static('dist/public'))
    this.app = app
  }

  get port(): number {
    return this._port
  }

  async configureTables(routes: ApiRoute[]) {
    if (!this.express) throw new Error('Express not initialized')
    for (const route of routes) {
      switch (route.method) {
        case 'GET':
          this.express.get(route.path, async (req, res) => {
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
          this.express.post(route.path, async (req, res) => {
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
          this.express.patch(route.path, async (req, res) => {
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
          this.express.delete(route.path, async (req, res) => {
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
    }
  }

  async configurePages(routes: PageRoute[]) {
    if (!this.express) throw new Error('Express not initialized')
    this.express.get('/bundle.js', async (req, res) => {
      const bundle = await fs.readFile(path.resolve(__dirname, '../../../../bundle.js'), 'utf8')
      return res.send(bundle)
    })
    for (const route of routes) {
      this.express.get(route.path, async (req, res) => {
        const Page = await route.handler({ path: req.url.split('?')[0], params: req.params })
        const pageHtml = ReactDOMServer.renderToString(<Page />)
        if (!this.app) throw new Error('App not initialized')
        const page = this.app.getPageByPath(route.path)
        const data: FoundationData = {
          page: PageMapper.toDto(page),
          params: req.params,
          tables: TableMapper.toDtos(this.app.tables),
          adapters: { uiName: this._uiName },
        }
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${route.title}</title>
              <script>
                window.__FOUNDATION_DATA__ = ${JSON.stringify(data)}
              </script>
              <link href="/output.css" rel="stylesheet">
            </head>
            <body>
              <div id="root">${pageHtml}</div>
              <script src="/bundle.js"></script>
            </body>
          </html>
        `
        res.send(html)
      })
    }
  }

  async configureStorage(routes: ApiRoute[]) {
    if (!this.express) throw new Error('Express not initialized')
    for (const route of routes) {
      switch (route.method) {
        case 'GET':
          this.express.get(route.path, async (req, res) => {
            const options: RequestDto = {
              method: req.method,
              path: req.url.split('?')[0],
              params: req.params,
            }
            const { status = 200, file, headers = {}, json = {} } = await route.handler(options)
            res.status(status)
            if (status === 200 && file) {
              Object.keys(headers).forEach((key) => {
                res.setHeader(key, headers[key])
              })
              res.sendFile(file, { headers })
            } else {
              res.json(json)
            }
          })
          break
        default:
          break
      }
    }
  }

  async start(): Promise<void> {
    await new Promise((resolve, rejects) => {
      if (!this.express) throw new Error('Express not initialized')
      this.server = this.express.listen(this.port, () => {
        resolve(true)
      })
      this.server.on('error', async (error: unknown) => {
        rejects({ error })
      })
    })
  }

  async stop(): Promise<void> {
    await new Promise((resolve) => {
      if (!this.server) throw new Error('Server not initialized')
      this.server.close(() => {
        resolve(true)
      })
    })
  }
}
