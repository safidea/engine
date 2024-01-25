import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { IServer, IServerHandler, IServerInstance } from '@domain/drivers/IServer'
import type { ILogger, ILoggerLog } from '@domain/drivers/ILogger'

const dirname = new URL('.', import.meta.url).pathname

interface NetworkError extends Error {
  code?: string
}

export class ExpressServer implements IServer {
  constructor(private logger: ILogger) {}

  create(port?: number) {
    return new ExpressServerInstance(this.logger, port)
  }
}

class ExpressServerInstance implements IServerInstance {
  private log: ILoggerLog
  private express: Express
  private server?: HttpServer
  private listening = false

  constructor(
    private logger: ILogger,
    private port?: number
  ) {
    this.log = logger.init('server:' + port)
    this.express = express()
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(cookieParser())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(join(dirname, 'public')))
    this.express.use(express.static('public'))
    this.express.get('/health', (_, res) => res.json({ success: true }))
  }

  async get(path: string, handler: IServerHandler) {
    this.express.get(path, async (_, res) => {
      const response = await handler()
      res.send(response.html)
    })
  }

  async start() {
    const maxRetries = 5
    const retryDelay = 1000
    let currentRetry = 0
    while (currentRetry < maxRetries) {
      try {
        const port = await this.getPort()
        const options = { port }
        const server = http.createServer(this.express)
        await new Promise((resolve, reject) => {
          server
            .listen(options, () => resolve(null))
            .on('error', (err: NetworkError) => {
              if (err.code === 'EADDRINUSE') {
                this.log(`Port ${port} is in use, retrying...`)
                currentRetry++
                setTimeout(() => reject(err), retryDelay)
              } else {
                reject(err)
              }
            })
        })
        this.server = server
        this.listening = true
        return `http://localhost:${port}`
      } catch (error) {
        if (currentRetry >= maxRetries) {
          throw new Error(`Failed to start server after ${maxRetries} attempts`)
        }
      }
    }
    throw new Error('Unable to start server after multiple attempts')
  }

  async stop() {
    if (this.server) this.server.close()
    this.listening = false
  }

  isListening() {
    return this.listening
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
    this.log = this.logger.init('server:' + port)
    return port
  }
}
