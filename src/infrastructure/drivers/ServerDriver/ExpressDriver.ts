import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import * as Sentry from '@sentry/node'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { IServerDriver } from '@adapter/spi/drivers/ServerSpi'
import type { DeleteDto, GetDto, PatchDto, PostDto, RequestDto } from '@adapter/spi/dtos/RequestDto'
import type { ServerConfig } from '@domain/services/Server'
import type { Response } from '@domain/entities/Response'
import { RedirectResponse } from '@domain/entities/Response/Redirect'
import { StreamResponse } from '@domain/entities/Response/Stream'

const dirname = new URL('.', import.meta.url).pathname

export class ExpressDriver implements IServerDriver {
  private _express: Express
  private _server?: HttpServer

  constructor(private _config: ServerConfig) {
    const { env } = _config
    this._express = express()
    if (env === 'production') this._express.use(helmet())
    this._express.use(cors())
    this._express.use(cookieParser())
    this._express.use(express.json())
    this._express.use(express.urlencoded({ extended: true }))
    this._express.use(express.static(join(process.cwd(), 'public')))
    this._express.use(express.static(join(dirname, 'public')))
  }

  get = async (path: string, handler: (getDto: GetDto) => Promise<Response>) => {
    this._express.get(path, async (req, res) => {
      const getDto: GetDto = { ...this._getRequestDto(req), method: 'GET' }
      const response = await handler(getDto)
      this._returnResponse(res, req, response)
    })
  }

  post = async (path: string, handler: (postDto: PostDto) => Promise<Response>) => {
    this._express.post(path, async (req, res) => {
      const postDto: PostDto = {
        ...this._getRequestDto(req),
        body: req.body,
        method: 'POST',
      }
      const response = await handler(postDto)
      this._returnResponse(res, req, response)
    })
  }

  patch = async (path: string, handler: (patchDto: PatchDto) => Promise<Response>) => {
    this._express.patch(path, async (req, res) => {
      const patchDto: PatchDto = {
        ...this._getRequestDto(req),
        body: req.body,
        method: 'PATCH',
      }
      const response = await handler(patchDto)
      this._returnResponse(res, req, response)
    })
  }

  delete = async (path: string, handler: (deleteDto: DeleteDto) => Promise<Response>) => {
    this._express.delete(path, async (req, res) => {
      const deleteDto: DeleteDto = { ...this._getRequestDto(req), method: 'DELETE' }
      const response = await handler(deleteDto)
      this._returnResponse(res, req, response)
    })
  }

  notFound = async (handler: (requestDto: RequestDto) => Promise<Response>) => {
    this._express.use(async (req, res) => {
      let requestDto: RequestDto
      if (req.method === 'GET') {
        requestDto = { ...this._getRequestDto(req), method: 'GET' }
      } else if (req.method === 'POST') {
        requestDto = {
          ...this._getRequestDto(req),
          body: req.body,
          method: 'POST',
        }
      } else if (req.method === 'PATCH') {
        requestDto = {
          ...this._getRequestDto(req),
          body: req.body,
          method: 'PATCH',
        }
      } else if (req.method === 'DELETE') {
        requestDto = { ...this._getRequestDto(req), method: 'DELETE' }
      } else {
        res.status(404).send('Not found')
        return
      }
      const response = await handler(requestDto)
      this._returnResponse(res, req, { ...response, status: 404 })
    })
  }

  afterAllRoutes = async () => {
    if (this._config.monitors?.includes('Sentry')) Sentry.setupExpressErrorHandler(this._express)
  }

  start = async (retry = 0, basePort?: number): Promise<number> => {
    if (!basePort) basePort = await this._getPort()
    try {
      const port = basePort + retry
      const options = { port }
      const server = http.createServer(this._express)
      await new Promise((resolve, reject) => {
        server.listen(options, () => resolve(null))
        server.on('error', (err) => reject(err))
      })
      this._server = server
      return port
    } catch (err) {
      if (err instanceof Error && err.message.includes('EADDRINUSE') && retry < 10) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.start(retry + 1, basePort)
      }
      throw err
    }
  }

  stop = async () => {
    if (this._server) this._server.close()
  }

  private _getPort = async () => {
    if (this._config.port) return Number(this._config.port)
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

  private _returnResponse = (res: express.Response, req: express.Request, response: Response) => {
    const { status, headers, body, url } = response
    if (response instanceof StreamResponse) {
      res.status(status).set(headers)
      response.onEvent = (event: string) => {
        const success = res.write(event)
        if (!success) response.close()
      }
      req.socket.on('close', () => response.close())
    } else if (response instanceof RedirectResponse) {
      // https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission
      res.redirect(303, url)
    } else {
      res.status(status).set(headers).send(body)
    }
  }

  private _getRequestDto = (req: express.Request): Omit<RequestDto, 'method'> => {
    const query: { [key: string]: string } = {}
    Object.keys(req.query).forEach((key) => {
      const value = req.query[key]
      if (typeof value === 'string') {
        query[key] = value
      } else if (Array.isArray(value)) {
        query[key] = value.join(',')
      }
    })
    return {
      path: req.path,
      baseUrl: `${req.protocol}://${req.get('host')}`,
      headers: {},
      query,
      params: req.params,
    }
  }
}
