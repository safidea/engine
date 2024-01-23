import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import type { IServer, IServerHandler, IServerInstance } from '@domain/drivers/IServer'
import type { ILogger, ILoggerLog } from '@domain/drivers/ILogger'

interface NetworkError extends Error {
  code?: string
}

export class ExpressServer implements IServer {
  constructor(private logger: ILogger) {}

  create(port?: number, host?: string) {
    return new ExpressServerInstance(this.logger, port, host)
  }
}

class ExpressServerInstance implements IServerInstance {
  private log: ILoggerLog
  private express: Express
  private server: HttpServer

  constructor(
    private logger: ILogger,
    private port?: number,
    private host?: string
  ) {
    this.log = logger.init('server:express:' + port)
    this.express = express()
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(cookieParser())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use((req, _, next) => {
      this.log(`${req.method} ${req.originalUrl}`)
      next()
    })
    this.server = http.createServer(this.express)
    this.server.on('error', (e: NetworkError) => {
      if (e.code === 'EADDRINUSE') {
        this.log('Address in use, retrying...')
        setTimeout(async () => {
          this.server.close()
          const port = await this.getPort()
          const host = this.getHost()
          this.server.listen(port, host)
        }, 1000)
      } else {
        this.log(e.message)
      }
    })
  }

  async get(path: string, handler: IServerHandler) {
    this.express.get(path, async (_, res) => {
      const response = await handler()
      res.send(response.html)
    })
  }

  async start() {
    const port = await this.getPort()
    const host = this.getHost()
    const options = { port, host }
    await new Promise((resolve) => this.server.listen(options, () => resolve(null)))
    const url = `http://localhost:${port}`
    this.log(`Server started at ${url}`)
    return url
  }

  async stop() {
    this.server.close()
    this.log(`Server stopped`)
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
    this.log = this.logger.init('server:express:' + port)
    return port
  }

  private getHost() {
    return this.host ?? 'localhost'
  }
}
