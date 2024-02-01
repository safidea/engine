import type { Server } from '@domain/services/Server'
import type { Engine } from './Engine'
import type { Component } from './Component'
import type { Logger } from '@domain/services/Logger'
import type { Head } from './Head'
import { HTMLResponse } from '@domain/services/Response/HTML'
import type { UI } from '@domain/services/UI'

export interface PageConfig {
  name: string
  path: string
  head: Head
  body: Component[]
}

export interface PageParams {
  server: Server
  logger: Logger
  component: Component
  ui: UI
}

export class Page implements Engine {
  name: string

  constructor(
    private config: PageConfig,
    private params: PageParams
  ) {
    const { server, logger } = params
    this.name = config.name
    server.get(this.path, this.get)
    logger.log(`GET mounted on ${this.path}`)
  }

  get path() {
    return this.config.path
  }

  get = async () => {
    const { body, head } = this.config
    const { ui } = this.params
    const html = ui.render(
      <head.render>
        {body.map((component, index) => (
          <component.render key={index} />
        ))}
      </head.render>
    )
    return new HTMLResponse(html)
  }

  validateConfig() {
    return []
  }
}
