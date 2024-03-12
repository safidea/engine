import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { Driver } from '@adapter/spi/ServerSpi'
import type { GetDto, PatchDto, PostDto } from '@adapter/spi/dtos/RequestDto'
import type { Params } from '@domain/services/Server'
import type { Response } from '@domain/entities/response'
import { Redirect } from '@domain/entities/response/Redirect'
import { Stream } from '@domain/entities/response/Stream'

const dirname = new URL('.', import.meta.url).pathname

export class ServerDriver implements Driver {
  public baseUrl: string
  private express: Express
  private server?: HttpServer

  constructor(public params: Params) {
    this.baseUrl = `http://localhost:${params.port}`
    this.express = express()
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(cookieParser())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(join(dirname, '../..', 'public')))
    this.express.use(express.static(join(process.cwd(), 'public')))
  }

  get = async (path: string, handler: (getDto: GetDto) => Promise<Response>) => {
    this.express.get(path, async (req, res) => {
      const getDto: GetDto = this.getRequestDto(req)
      const response = await handler(getDto)
      this.returnResponse(res, req, response)
    })
  }

  post = async (path: string, handler: (postDto: PostDto) => Promise<Response>) => {
    this.express.post(path, async (req, res) => {
      const postDto: PostDto = {
        ...this.getRequestDto(req),
        body: req.body,
      }
      const response = await handler(postDto)
      this.returnResponse(res, req, response)
    })
  }

  patch = async (path: string, handler: (patchDto: PatchDto) => Promise<Response>) => {
    this.express.patch(path, async (req, res) => {
      const patchDto: PatchDto = {
        ...this.getRequestDto(req),
        body: req.body,
      }
      const response = await handler(patchDto)
      this.returnResponse(res, req, response)
    })
  }

  notFound = async (handler: (getDto: GetDto) => Promise<Response>) => {
    this.express.use(async (req, res) => {
      const getDto: GetDto = this.getRequestDto(req)
      const response = await handler(getDto)
      this.returnResponse(res, req, { ...response, status: 404 })
    })
  }

  start = async (retry = 0): Promise<string> => {
    try {
      const port = await this.getPort()
      const options = { port }
      const server = http.createServer(this.express)
      await new Promise((resolve, reject) => {
        try {
          server.listen(options, () => resolve(null))
        } catch (err) {
          reject(err)
        }
      })
      this.server = server
      this.baseUrl = `http://localhost:${port}`
      return this.baseUrl
    } catch (err) {
      if (err instanceof Error && err.message.includes('EADDRINUSE') && retry < 10) {
        return this.start(++retry)
      }
      throw err
    }
  }

  stop = async () => {
    if (this.server) this.server.close()
  }

  private getPort = async () => {
    if (this.params.port) return Number(this.params.port)
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

  private returnResponse = (res: express.Response, req: express.Request, response: Response) => {
    const { status, headers, body } = response
    if (response instanceof Stream) {
      res.status(status).set(headers)
      response.onEvent = (event: string) => {
        const success = res.write(event)
        if (!success) response.close()
      }
      req.socket.on('close', () => response.close())
    } else if (response instanceof Redirect) {
      // https://turbo.hotwired.dev/handbook/drive#redirecting-after-a-form-submission
      res.redirect(303, body)
    } else {
      res.status(status).set(headers).send(body)
    }
  }

  private getRequestDto = (req: express.Request): GetDto => {
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
