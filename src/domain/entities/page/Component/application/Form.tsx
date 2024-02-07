import type { Server } from '@domain/services/Server'
import type { Base, ReactComponent, InputType } from '../base'
import type { Post } from '@domain/services/request/Post'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Response } from '@domain/services/response'
import { Html } from '@domain/services/response/Html'
import type { Ui } from '@domain/services/Ui'

export interface Props {
  title: string
  description: string
  action?: string
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
  private path = '#'
  private props: Props
  private successMessage?: string

  constructor(private params: Params) {
    const { idGenerator, props, server } = params
    this.id = idGenerator.forForm()
    if (props.action) {
      this.path = `/api/form/${this.id}`
      server.post(this.path, this.post)
    }
    const { successMessage, ...res } = props
    this.props = {
      ...res,
      action: this.path,
      method: 'POST',
    }
    this.successMessage = successMessage
  }

  post = async (request: Post): Promise<Response> => {
    const { action, method } = this.params.props
    if (action) {
      const url = action.startsWith('/') ? request.baseUrl + action : action
      const result = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.body),
      })
      if (result.ok) {
        return new Html(this.html({ successMessage: this.successMessage }))
      } else {
        const errorMessage = await result.text()
        return new Html(this.html({ errorMessage }))
      }
    }
    return new Html(this.html())
  }

  html = (props?: Partial<Props>) => {
    const { ui } = this.params
    return ui.renderToHtml(this.render(props))
  }

  render = (props?: Partial<Props>) => {
    const { ui, component: Component } = this.params
    return (
      <ui.Frame id={`form-${this.id}`}>
        <Component {...{ ...this.props, ...props }} />
      </ui.Frame>
    )
  }
}
