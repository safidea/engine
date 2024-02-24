import type { Server } from '@domain/services/Server'
import type { Base, ReactComponent, InputType, BaseProps } from '../base/base'
import type { Post } from '@domain/entities/request/Post'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Response } from '@domain/entities/response'
import { Html } from '@domain/entities/response/Html'
import type { Ui } from '@domain/services/Ui'

export interface Props extends BaseProps {
  action: string
  title?: string
  description?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  inputs: {
    name: string
    type?: InputType
    placeholder?: string
    label?: string
    required?: boolean
  }[]
  submitButton: {
    label: string
  }
  successMessage?: string
  errorMessage?: string
}

interface Params {
  props: Props
  component: ReactComponent<Props>
  server: Server
  idGenerator: IdGenerator
  ui: Ui
}

export class Form implements Base<Props> {
  private id: string
  private path: string
  private props: Props
  private successMessage?: string

  constructor(private params: Params) {
    const { idGenerator, props } = params
    this.id = idGenerator.forForm()
    this.path = `/api/component/form/${this.id}`
    const { successMessage, ...res } = props
    this.props = {
      ...res,
      action: this.path,
      method: 'POST',
    }
    this.successMessage = successMessage
  }

  init = async () => {
    const { server } = this.params
    await server.post(this.path, this.post)
  }

  post = async (request: Post): Promise<Response> => {
    const { action, method = 'POST' } = this.params.props
    const url = action.startsWith('/') ? request.baseUrl + action : action
    const result = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    })
    if (result.ok) {
      const html = await this.html({ successMessage: this.successMessage })
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
    const { ui, component: Component } = this.params
    return (props?: Partial<Props>) => (
      <ui.Frame id={this.id}>
        <Component {...{ ...this.props, ...props }} />
      </ui.Frame>
    )
  }

  validateConfig = () => {
    return []
  }
}
