import type { Server } from '@domain/services/Server'
import type { Component } from '../Component'
import type { Logger } from '@domain/services/Logger'
import type { Head } from '../Head'
import { Html as HtmlResponse } from '@domain/entities/Response/Html'
import { State } from './State'
import type { Get } from '@domain/entities/Request/Get'
import type { Client } from '@domain/services/Client'

export interface Config {
  name: string
  path: string
}

export interface Services {
  server: Server
  logger: Logger
  client: Client
}

export interface Entities {
  head: Head
  body: Component[]
}

export class Page {
  readonly name: string
  readonly path: string

  constructor(
    config: Config,
    private _services: Services,
    private _entities: Entities
  ) {
    const { name, path } = config
    this.name = name
    this.path = path
  }

  init = async () => {
    const { server } = this._services
    const { body } = this._entities
    await Promise.all(body.map((component) => component.init()))
    if (this.path === '/404') {
      await server.notFound(this.get)
    } else {
      await server.get(this.path, this.get)
    }
  }

  validateConfig = async () => {
    const { body } = this._entities
    return Promise.all(body.flatMap((component) => component.validateConfig()))
  }

  get = async (request: Get) => {
    const state = new State(request)
    return new HtmlResponse(await this.html(state))
  }

  html = async (state: State) => {
    const { client } = this._services
    return client.renderToHtml(await this.render(state))
  }

  render = async (state: State) => {
    const { body, head } = this._entities
    const { components } = this._services.client
    const children = await Promise.all(body.map((component) => component.render(state)))
    return (
      <components.Html
        head={head ? head.render() : null}
        body={children.map((Component, index) => (
          <Component key={index} />
        ))}
      />
    )
  }
}
