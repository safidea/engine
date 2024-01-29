import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { IServer, IServerHandler, IServerInstance } from '@domain/drivers/server/IServer'
import type { ILogger, ILoggerLog } from '@domain/drivers/ILogger'
import { isServerResponse, type ServerResponse } from '@domain/drivers/server/response'
import { isJsonServerResponse } from '@domain/drivers/server/response/json'
import { isRedirectServerResponse } from '@domain/drivers/server/response/redirect'
import { isStreamServerResponse } from '@domain/drivers/server/response/stream'
import { isTextServerResponse } from '@domain/drivers/server/response/text'

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
    this.express.use(express.static(join(process.cwd(), 'public')))
    this.express.get('/health', (_, res) => res.json({ success: true }))
  }

  get(path: string, handler: IServerHandler) {
    this.express.get(path, async (req, res) => {
      try {
        const response = await handler()
        this.sendResponse(req, res, response)
      } catch (error) {
        this.catchError(req, res, error)
      }
    })
  }

  post(path: string, handler: IServerHandler) {
    this.express.post(path, async (req, res) => {
      try {
        const response = await handler()
        this.sendResponse(req, res, response)
      } catch (error) {
        this.catchError(req, res, error)
      }
    })
  }

  notFound(handler: IServerHandler) {
    this.express.use(async (req, res) => {
      try {
        const response = await handler()
        this.sendResponse(req, res, response)
      } catch (error) {
        this.catchError(req, res, error)
      }
    })
  }

  private sendResponse = (
    req: express.Request,
    res: express.Response,
    response: ServerResponse
  ) => {
    const { statusCode } = response
    res.status(statusCode)
    if (isJsonServerResponse(response)) {
      const { body } = response
      res.json(body)
      this.log(`${statusCode} JSON ${JSON.stringify(body)}`)
    } else if (isTextServerResponse(response)) {
      const { headers, body } = response
      if (headers) res.set(headers)
      res.send(body)
      this.log(`${statusCode} TEXT`)
    } else if (isRedirectServerResponse(response)) {
      const { path } = response
      res.redirect(statusCode, path)
      this.log(`${statusCode} REDIRECT ${path}`)
    } else if (isStreamServerResponse(response)) {
      res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      response.onEvent((event: string) => {
        const success = res.write(event)
        if (!success) response.close()
      })
      req.socket.on('close', () => response.close())
      this.log(`${statusCode} STREAM`)
    }
  }

  private catchError(req: express.Request, res: express.Response, error: unknown) {
    if (isServerResponse(error)) {
      this.sendResponse(req, res, error)
    } else {
      this.log(`ERROR ${error}`)
      res.status(500).send('Internal Server Error')
    }
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
