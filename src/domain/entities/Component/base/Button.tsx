import type { Method } from '@domain/entities/Request'
import type { ReactComponent, Base, BaseProps } from './base'
import type { Client } from '@domain/services/Client'
import { State } from '@domain/entities/Page/State'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import type { Template } from '@domain/services/Template'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Server } from '@domain/services/Server'
import type { Post } from '@domain/entities/Request/Post'
import { Html } from '@domain/entities/Response/Html'
import type { Response } from '@domain/entities/Response'
import { Redirect } from '@domain/entities/Response/Redirect'
import type { Ui } from '@domain/services/Ui'

export type Variant = 'primary' | 'secondary'
export type Type = 'button' | 'submit' | 'reset'

export interface Props extends BaseProps {
  label: string
  href?: string
  type?: Type
  variant: Variant
  actionClientProps?: { [key: string]: string }
  action?: string
  method?: Method
  formId?: string
}

interface Params extends Omit<Props, 'actionClientProps' | 'formId'> {
  onSuccess?:
    | {
        redirect: string
      }
    | { notification: { message: string; type: 'success' | 'error' } }
  Component: ReactComponent<Props>
  templateCompiler: TemplateCompiler
  client: Client
  idGenerator: IdGenerator
  server: Server
  ui: Ui
}

export class Button implements Base<Props> {
  private id: string
  private path: string
  private action?: Template

  constructor(private _params: Params) {
    const { action, templateCompiler, idGenerator } = _params
    this.id = idGenerator.forComponent()
    this.path = `/api/component/button/${this.id}`
    if (action) this.action = templateCompiler.compile(action)
  }

  init = async () => {
    const { server } = this._params
    if (this.action) await server.post(this.path, this.post)
  }

  post = async (request: Post): Promise<Response> => {
    if (!this.action) throw new Error('Button has no action')
    const state = new State(request)
    const { method = 'POST', server, onSuccess } = this._params
    const filledAction = state.fillTemplate(this.action)
    const url = filledAction.startsWith('/') ? server.baseUrl + filledAction : filledAction
    const result = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.body),
    })
    if (result.ok && onSuccess) {
      if ('redirect' in onSuccess) return new Redirect(onSuccess.redirect)
    }
    const html = await this.html(state)
    return new Html(html)
  }

  html = async (state: State, props?: Partial<Props>) => {
    const { ui } = this._params
    const Component = await this.render(state)
    return ui.renderToHtml(<Component {...props} />)
  }

  render = async (state: State) => {
    const { id, className, label, href, variant, Component, client } = this._params
    const action = this.action ? state.addQueryToPath(this.path) : undefined
    const actionClientProps = client.getActionProps({ reloadPageFrame: true })
    return (props?: Partial<Props>) => (
      <client.Frame id={this.id}>
        <Component
          {...{
            id,
            className,
            label,
            href,
            variant,
            action,
            method: 'POST',
            actionClientProps,
            ...props,
          }}
        />
      </client.Frame>
    )
  }

  validateConfig = () => {
    return []
  }
}
