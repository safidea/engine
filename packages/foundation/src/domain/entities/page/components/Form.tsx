import React from 'react'
import { IUIGateway } from '@domain/gateways/IUIGateway'
import { BaseComponent } from './BaseComponent'
import { Input } from './Input'

export type HandleChange = (name: string, value: string | { [key: string]: string }[]) => void
export interface FormProps {
  handleSubmit: (e: { preventDefault: () => void }) => Promise<void>
  handleChange: HandleChange
  InputComponents: React.FC<{ handleChange: HandleChange }>[]
}

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
    const submit = this._submit
    return function Component({ handleSubmit, handleChange, InputComponents }: FormProps) {
      return (
        <UI.form onSubmit={handleSubmit}>
          <UI.inputs>
            {InputComponents.map((InputComponent, index) => (
              <UI.input key={index}>
                <InputComponent handleChange={handleChange} />
              </UI.input>
            ))}
          </UI.inputs>
          <UI.submit label={submit.label} />
        </UI.form>
      )
    }
  }
}
