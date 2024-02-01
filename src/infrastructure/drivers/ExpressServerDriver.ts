import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import http, { Server as HttpServer } from 'http'
import net from 'net'
import { join } from 'path'
import type { ServerDriver } from '@adapter/spi/ServerSPI'
import type { GetDto, PostDto } from '@adapter/spi/dtos/RequestDto'
import type { ResponseDto } from '@adapter/spi/dtos/ResponseDto'

const dirname = new URL('.', import.meta.url).pathname

export class ExpressServerDriver implements ServerDriver {
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

  get = async (path: string, handler: (getDto: GetDto) => Promise<ResponseDto>) => {
    this.express.get(path, async (req, res) => {
      const getDto: GetDto = { path: req.path, query: {}, params: {} }
      const { status, headers, body } = await handler(getDto)
      res.status(status)
      res.set(headers)
      res.send(body)
    })
  }

  post = async (path: string, handler: (postDto: PostDto) => Promise<ResponseDto>) => {
    this.express.post(path, async (req, res) => {
      const postDto: PostDto = { path: req.path, query: {}, params: {}, body: req.body }
      const { status, headers, body } = await handler(postDto)
      res.status(status)
      res.set(headers)
      res.send(body)
    })
  }

  start = async () => {
    const port = await this.getPort()
    const options = { port }
    const server = http.createServer(this.express)
    await new Promise((resolve) => server.listen(options, () => resolve(null)))
    this.server = server
    return `http://localhost:${port}`
  }

  stop = async () => {
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
