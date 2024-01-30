import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { IServerDriver } from '@adapter/spi/drivers/IServerDriver'

const dirname = new URL('.', import.meta.url).pathname

export class ServerDriver implements IServerDriver {
  private express: Express
  private server?: HttpServer

  constructor(private port?: number) {
    this.express = express()
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(cookieParser())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(join(dirname, 'public')))
    this.express.use(express.static(join(process.cwd(), 'public')))
  }

  async start() {
    const port = await this.getPort()
    const options = { port }
    const server = http.createServer(this.express)
    await new Promise((resolve) => server.listen(options, () => resolve(null)))
    this.server = server
    return `http://localhost:${port}`
  }

  async stop() {
    if (this.server) this.server.close()
  }

  private async getPort() {
    if (this.port) return this.port
    const port: number = await new Promise((resolve, reject) => {
      const srv = net.createServer()
      srv.listen(0, function () {
        const address = srv.address()
        srv.close()
        if (!address || typeof address === 'string') return reject(address)
        resolve(address.port)
      })
    })
    return port
  }
}
