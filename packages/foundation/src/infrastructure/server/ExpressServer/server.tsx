import React from 'react'
import { IServerAdapter, ApiRoute, PageRoute } from '@adapter/spi/server/IServerAdapter'
import express, { Express } from 'express'
import { Server } from 'http'
import ReactDOMServer from 'react-dom/server'
import path from 'path'
import fs from 'fs-extra'
import { AppDto } from '@adapter/api/app/dtos/AppDto'
import { App } from '@domain/entities/app/App'
import { AppMapper } from '@adapter/api/app/mappers/AppMapper'
import { RequestDto, RequestQueryDto } from '@adapter/spi/server/dtos/RequestDto'

export interface FoundationData {
  app: AppDto
  path: string
  params: { [key: string]: string }
}

export class ExpressServer implements IServerAdapter {
  private express?: Express
  private app?: App
  private server?: Server

  constructor(private port: number) {}

  initConfig(app: App) {
    this.express = express()
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.app = app
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
    this.express.get('/express.bundle.js', async (req, res) => {
      const bundle = await fs.readFile(
        path.resolve(__dirname, '../../../../express.bundle.js'),
        'utf8'
      )
      return res.send(bundle)
    })
    for (const route of routes) {
      this.express.get(route.path, async (req, res) => {
        const Page = await route.handler({ path: req.url.split('?')[0], params: req.params })
        const pageHtml = ReactDOMServer.renderToString(<Page />)
        if (!this.app) throw new Error('App not initialized')
        const data: FoundationData = {
          app: AppMapper.toDto(this.app),
          path: route.path,
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
              <script src="/express.bundle.js"></script>
            </body>
          </html>
        `
        res.send(html)
      })
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
