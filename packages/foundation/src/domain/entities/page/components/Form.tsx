import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'

// TODO create a real entity for Input
export type Input = unknown

export class Form extends BaseComponent {
  constructor(
    private readonly _table: string,
    private readonly _inputs: Input[],
    private readonly _submit: {
      label: string
      loadingLabel: string
      actionsOnSuccess: {
        type: string
        path: string
      }[]
    },
    private readonly _ui: IUIGateway['FormUI']
  ) {
    super('title')
  }

  get table() {
    return this._table
  }

  get inputs() {
    return this._inputs
  }

  get submit() {
    return this._submit
  }

  get ui() {
    return this._ui
  }

  renderUI() {
    const UI = this._ui
    const inputs = this._inputs
    return function Component() {
      return (
        <UI.form>
          {inputs.map((input, index) => (
            <UI.input key={index} />
          ))}
        </UI.form>
      )
    }
  }
}
