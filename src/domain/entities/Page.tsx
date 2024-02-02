import type { Server } from '@domain/services/Server'
import type { Engine } from './Engine'
import type { Component } from './Component'
import type { Logger } from '@domain/services/Logger'
import type { Head } from './Head'
import { Html as HtmlResponse } from '@domain/services/Response/HTML'
import type { Ui } from '@domain/services/Ui'
import type { HtmlProps } from './Component/Html'
import type { ReactComponent } from './Component/base'

export interface PageConfig {
  name: string
  path: string
  head: Head
  body: Component[]
}

export interface PageParams {
  server: Server
  logger: Logger
  ui: Ui
  Html: ReactComponent<HtmlProps>
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
    const { ui, Html } = this.params
    const html = ui.render(
      <Html
        head={<head.render />}
        body={body.map((component, index) => (
          <component.render key={index} />
        ))}
      />
    )
    return new HtmlResponse(html)
  }

  validateConfig() {
    return []
  }
}
