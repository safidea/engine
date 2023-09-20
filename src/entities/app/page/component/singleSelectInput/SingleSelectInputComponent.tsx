import React from 'react'
import { SingleSelectInputComponentParams } from './SingleSelectInputComponentParams'
import { SingleSelectInputComponentUI } from './SingleSelectInputComponentUI'
import { PageServices } from '@entities/app/page/PageServices'
import { BaseComponent } from '../base/BaseComponent'
import { PageConfig } from '../../Page'
import { BaseComponentProps } from '../base/BaseComponentProps'

export class SingleSelectInputComponent extends BaseComponent {
  constructor(
    readonly params: SingleSelectInputComponentParams,
    services: PageServices,
    config: PageConfig
  ) {
    const { type } = params
    super({ type }, services, config)
  }

  async render() {
    return ({ updateRecord, currentRecord }: BaseComponentProps) => {
      const value = currentRecord?.getFieldValue(this.params.field) ?? ''
      const handleUpdateRecord = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        if (updateRecord && currentRecord)
          updateRecord(currentRecord.id, e.target.name, e.target.value)
      }
      return (
        <SingleSelectInputComponentUI
          label={this.params.label}
          field={this.params.field}
          value={String(value)}
          options={this.params.options}
          onChange={handleUpdateRecord}
          ui={this.services.ui}
        />
      )
    }
  }
}
