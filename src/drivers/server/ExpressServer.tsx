import { Server } from 'http'
import path from 'path'
import express, { Express } from 'express'
import { ServerDriverOptions } from './index'
import { IServerDriver } from '@adapters/services/server/IServerDriver'
import { ServerRequest, ServerRequestQuery } from '@adapters/services/server/ServerRequest'
import { ServerHandler } from '@adapters/services/server/ServerHandler'

export class ExpressServer implements IServerDriver {
  private express: Express
  private server?: Server
  public port: number

  constructor(options: ServerDriverOptions) {
    this.port = options.port ?? 3000
    this.express = express()
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(path.join(__dirname, '../../../dist/client')))
  }

  get(path: string, handler: ServerHandler) {
    this.express.get(path, (req, res) => this.handleRequest(req, res, handler))
  }

  post(path: string, handler: ServerHandler) {
    this.express.post(path, (req, res) => this.handleRequest(req, res, handler))
  }

  patch(path: string, handler: ServerHandler) {
    this.express.patch(path, (req, res) => this.handleRequest(req, res, handler))
  }

  delete(path: string, handler: ServerHandler) {
    this.express.delete(path, (req, res) => this.handleRequest(req, res, handler))
  }

  private handleRequest = async (
    req: express.Request,
    res: express.Response,
    handler: ServerHandler
  ) => {
    const request: ServerRequest = {
      method: req.method,
      path: req.url.split('?')[0],
      params: req.params,
    }
    if (req.body) request.body = req.body
    if (req.query) {
      request.query = Object.keys(req.query).reduce((acc: ServerRequestQuery, key: string) => {
        acc[key] = String(req.query[key])
        return acc
      }, {})
    }
    const { status = 200, json, html } = await handler(request)
    res.status(status)
    if (html) {
      res.send(html)
    } else {
      res.json(json)
    }
  }

  async start(): Promise<void> {
    await new Promise((resolve, rejects) => {
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
      if (!this.server) throw new Error('Server not started')
      this.server.close(() => {
        this.server = undefined
        resolve(true)
      })
    })
  }
}
