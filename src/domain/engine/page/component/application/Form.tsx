import type { Server } from '@domain/services/Server'
import type { Base, ReactComponent, BaseProps } from '../base/base'
import type { Post } from '@domain/entities/request/Post'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Response } from '@domain/entities/response'
import { Html } from '@domain/entities/response/Html'
import type { Ui } from '@domain/services/Ui'
import type { Client } from '@domain/services/Client'
import type { Method } from '@domain/entities/request'
import type { Title } from '../base/Title'
import type { Paragraph } from '../base/Paragraph'
import type { Input } from '../base/Input'
import type { Button } from '../base/Button'
import type { ConfigError } from '@domain/entities/error/Config'

export interface Props extends BaseProps {
  action: string
  method?: Method
  Title?: React.FC
  Paragraph?: React.FC
  Inputs: React.FC[]
  Buttons: React.FC[]
  successMessage?: string
  errorMessage?: string
}

interface Params {
  action: string
  method?: Method
  title?: Title
  paragraph?: Paragraph
  inputs: Input[]
  buttons: Button[]
  successMessage?: string
  Component: ReactComponent<Props>
  server: Server
  idGenerator: IdGenerator
  ui: Ui
  client: Client
}

export class Form implements Base<Props> {
  private id: string
  private path: string

  constructor(private params: Params) {
    const { idGenerator } = params
    this.id = idGenerator.forForm()
    this.path = `/api/component/form/${this.id}`
  }

  init = async () => {
    const { server, title, paragraph, inputs, buttons } = this.params
    await Promise.all([
      server.post(this.path, this.post),
      title?.init(),
      paragraph?.init(),
      ...inputs.map((input) => input.init()),
      ...buttons.map((button) => button.init()),
    ])
  }

  post = async (request: Post): Promise<Response> => {
    const { action, method = 'POST', successMessage } = this.params
    const url = action.startsWith('/') ? request.baseUrl + action : action
    const result = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    })
    if (result.ok) {
      const html = await this.html({ successMessage })
      return new Html(html)
    } else {
      const errorMessage = await result.text()
      const html = await this.html({ errorMessage })
      return new Html(html)
    }
  }

  html = async (props?: Partial<Props>) => {
    const { ui } = this.params
    const Component = await this.render()
    return ui.renderToHtml(<Component {...props} />)
  }

  render = async () => {
    const { client, Component, title, paragraph, inputs, buttons } = this.params
    const Buttons = await Promise.all(buttons.map((button) => button.render()))
    const Title = title ? await title.render() : undefined
    const Paragraph = paragraph ? await paragraph.render() : undefined
    const Inputs = await Promise.all(inputs.map((input) => input.render()))
    return (props?: Partial<Props>) => (
      <client.Frame id={this.id}>
        <Component
          {...{
            action: this.path,
            method: 'POST',
            Title,
            Paragraph,
            Inputs,
            Buttons,
            ...props,
          }}
        />
      </client.Frame>
    )
  }

  validateConfig = () => {
    const { title, paragraph, inputs, buttons } = this.params
    const errors: ConfigError[] = []
    if (title) errors.push(...title.validateConfig())
    if (paragraph) errors.push(...paragraph.validateConfig())
    inputs.forEach((input) => errors.push(...input.validateConfig()))
    buttons.forEach((button) => errors.push(...button.validateConfig()))
    return errors
  }
}
