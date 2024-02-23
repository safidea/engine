import { Server } from 'http'
import path from 'path'
import fs from 'fs-extra'
import express, { Express } from 'express'
import { ServerDriverOptions } from './index'
import { IServerDriver } from '@adapters/controllers/server/IServerDriver'
import { IServerHandler } from '@adapters/controllers/server/IServerHandler'
import { IServerRequest, IServerRequestQuery } from '@adapters/controllers/server/IServerRequest'

export class ExpressServer implements IServerDriver {
  private express: Express
  private server?: Server
  public port: number

  constructor(options: ServerDriverOptions) {
    this.port = options.port
    const publicFolder = path.join(options.folder, 'public')
    fs.ensureDirSync(publicFolder)
    this.express = express()
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(path.join(__dirname, '../../../dist/public')))
    this.express.use(express.static(publicFolder))
  }

  get(path: string, handler: IServerHandler) {
    this.express.get(path, (req, res) => this.handleRequest(req, res, handler))
  }

  post(path: string, handler: IServerHandler) {
    this.express.post(path, (req, res) => this.handleRequest(req, res, handler))
  }

  patch(path: string, handler: IServerHandler) {
    this.express.patch(path, (req, res) => this.handleRequest(req, res, handler))
  }

  delete(path: string, handler: IServerHandler) {
    this.express.delete(path, (req, res) => this.handleRequest(req, res, handler))
  }

  private handleRequest = async (
    req: express.Request,
    res: express.Response,
    handler: IServerHandler
  ) => {
    const request: IServerRequest = {
      method: req.method,
      path: req.url.split('?')[0],
      params: req.params,
      headers: Object.keys(req.headers).reduce((acc: { [key: string]: string }, key: string) => {
        acc[key] = String(req.headers[key])
        return acc
      }, {}),
    }
    if (req.body) request.body = req.body
    if (req.query) {
      request.query = Object.keys(req.query).reduce((acc: IServerRequestQuery, key: string) => {
        acc[key] = String(req.query[key])
        return acc
      }, {})
    }
    const { status = 200, json, html, headers } = await handler(request)
    res.status(status)
    if (headers) res.set(headers)
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
