import type { Server } from '@domain/services/Server'
import type { Component } from '../Component'
import type { Logger } from '@domain/services/Logger'
import type { Head } from '../Head'
import { Html as HtmlResponse } from '@domain/entities/Response/Html'
import type { React } from '@domain/services/React'
import type { HtmlProps } from '../Component/base/Html'
import type { ReactComponent } from '../Component/base/base'
import { State } from './State'
import type { Get } from '@domain/entities/Request/Get'

interface Params {
  name: string
  path: string
  head: Head
  body: Component[]
  server: Server
  logger: Logger
  react: React
  Html: ReactComponent<HtmlProps>
}

export class Page {
  public name: string
  public path: string

  constructor(private _params: Params) {
    const { name, path } = _params
    this.name = name
    this.path = path
  }

  init = async () => {
    const { server, body } = this._params
    await Promise.all(body.map((component) => component.init()))
    if (this.path === '/404') {
      await server.notFound(this.get)
    } else {
      await server.get(this.path, this.get)
    }
  }

  validateConfig = async () => {
    const { body } = this._params
    return Promise.all(body.flatMap((component) => component.validateConfig()))
  }

  get = async (request: Get) => {
    const state = new State(request)
    return new HtmlResponse(await this.html(state))
  }

  html = async (state: State) => {
    const { react } = this._params
    return react.renderToHtml(await this.render(state))
  }

  render = async (state: State) => {
    const { body, head } = this._params
    const { Html } = this._params
    const components = await Promise.all(body.map((component) => component.render(state)))
    return (
      <Html
        head={head ? head.render() : null}
        body={components.map((Component, index) => (
          <Component key={index} />
        ))}
      />
    )
  }
}
