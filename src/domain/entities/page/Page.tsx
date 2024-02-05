import type { Server } from '@domain/services/Server'
import type { Engine } from '../Engine'
import type { Component } from './Component'
import type { Logger } from '@domain/services/Logger'
import type { Head } from './Head'
import { Html as HtmlResponse } from '@domain/services/Response/Html'
import type { Ui } from '@domain/services/Ui'
import type { HtmlProps } from './Component/Html'
import type { ReactComponent } from './Component/base'

interface Params {
  name: string
  path: string
  head?: Head
  body: Component[]
  server: Server
  logger: Logger
  ui: Ui
  Html: ReactComponent<HtmlProps>
}

export class Page implements Engine {
  constructor(private params: Params) {
    const { server, logger } = params
    server.get(this.path, this.get)
    logger.log(`GET mounted on ${this.path}`)
  }

  get name() {
    return this.params.name
  }

  get path() {
    return this.params.path
  }

  get = async () => {
    return new HtmlResponse(this.html())
  }

  html() {
    const { body, head } = this.params
    const { ui, Html } = this.params
    return ui.render(
      <Html
        head={head ? head.render() : null}
        body={body.map((component, index) => (
          <component.render key={index} />
        ))}
      />
    )
  }

  validateConfig() {
    return []
  }
}
