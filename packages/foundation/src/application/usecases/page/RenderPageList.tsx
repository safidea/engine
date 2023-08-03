import React from 'react'
import { FetcherGateway } from '@adapter/spi/gateways/FetcherGateway'
import { mapDtoToRecord } from '@application/mappers/table/RecordMapper'
import { List } from '@domain/entities/page/components/List'
import { AppGateway } from '@adapter/spi/gateways/AppGateway'
import { runFormula } from '@application/utils/FormulaUtils'

export class RenderPageList {
  constructor(
    private fetcherGateway: FetcherGateway,
    private appGateway: AppGateway
  ) {}

  execute(list: List): () => JSX.Element {
    const UI = list.renderUI()
    const getRecordsHook = this.fetcherGateway.getTableRecordsHook(list.table)
    const fields = this.appGateway.getTableFields(list.table)
    /*const buttons = list.buttons.map((button) => {
      const { action } = button
      if (!button.action) throw new Error('action is required for button')
      switch (action?.type) {
        case 'redirect':
          if (!action.path) throw new Error('path is required for redirect action')
          if (typeof action.path === 'object' && 'formula' in action.path) {
            const { formula } = action.path
            const path = await runFormula(formula)
            button.action.path = path
          }
          break
        default:
          throw new Error(`action type ${action?.type} is not supported`)
      }
      return button
    })*/
    return function Component() {
      const { records } = getRecordsHook()
      return (
        <UI records={records.map((recordDto) => mapDtoToRecord(list.table, recordDto, fields))} />
      )
    }
  }
}
