import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { Driver } from '@adapter/spi/ServerSpi'
import type { GetDto, PostDto } from '@adapter/spi/dtos/RequestDto'
import type { ResponseDto } from '@adapter/spi/dtos/ResponseDto'
import type { Params } from '@domain/services/Server'

const dirname = new URL('.', import.meta.url).pathname

export class ServerDriver implements Driver {
  private express: Express
  private server?: HttpServer

  constructor(public params: Params) {
    this.express = express()
    this.express.use(cors())
    this.express.use(helmet())
    this.express.use(cookieParser())
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(express.static(join(dirname, '../..', 'public')))
    this.express.use(express.static(join(process.cwd(), 'public')))
  }

  get = async (path: string, handler: (getDto: GetDto) => Promise<ResponseDto>) => {
    this.express.get(path, async (req, res) => {
      const getDto: GetDto = this.getRequestDto(req)
      const { status, headers, body } = await handler(getDto)
      res.status(status).set(headers).send(body)
    })
  }

  post = async (path: string, handler: (postDto: PostDto) => Promise<ResponseDto>) => {
    this.express.post(path, async (req, res) => {
      const postDto: PostDto = {
        ...this.getRequestDto(req),
        body: req.body,
      }
      const { status, headers, body } = await handler(postDto)
      res.status(status).set(headers).send(body)
    })
  }

  notFound = async (handler: (getDto: GetDto) => Promise<ResponseDto>) => {
    this.express.use(async (req, res) => {
      const getDto: GetDto = this.getRequestDto(req)
      const { headers, body } = await handler(getDto)
      res.status(404).set(headers).send(body)
    })
  }

  start = async (retry = 0): Promise<string> => {
    try {
      const port = await this.getPort()
      const options = { port }
      const server = http.createServer(this.express)
      await new Promise((resolve) => server.listen(options, () => resolve(null)))
      this.server = server
      return `http://localhost:${port}`
    } catch (err) {
      if (err instanceof Error && err.message.includes('EADDRINUSE') && retry < 10) {
        return this.start(++retry)
      }
      console.log(JSON.stringify(err, null, 2))
      throw err
    }
  }

  stop = async () => {
    if (this.server) this.server.close()
  }

  private async getPort() {
    if (this.params.port) return this.params.port
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

  private getRequestDto(req: express.Request): GetDto {
    return {
      path: req.path,
      baseUrl: `${req.protocol}://${req.get('host')}`,
      query: {},
      params: {},
    }
  }
}
