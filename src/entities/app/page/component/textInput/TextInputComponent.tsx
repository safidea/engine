import React from 'react'
import { TextInputComponentParams } from './TextInputComponentParams'
import { TextInputComponentUI } from './TextInputComponentUI'
import { PageServices } from '@entities/app/page/PageServices'
import { PageConfig } from '../../Page'
import { BaseComponent } from '../base/BaseComponent'
import { BaseComponentProps } from '../base/BaseComponentProps'

export class TextInputComponent extends BaseComponent {
  constructor(
    readonly params: TextInputComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { type } = params
    super({ type }, services, config)
  }

  async render() {
    return ({ updateRecord, currentRecord }: BaseComponentProps) => {
      const value = currentRecord?.getFieldValue(this.params.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (updateRecord && currentRecord)
          updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      return (
        <TextInputComponentUI
          label={this.params.label}
          field={this.params.field}
          onChange={handleUpdateRecord}
          value={String(value)}
          ui={this.services.ui}
        />
      )
    }
  }
}
