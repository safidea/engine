import React from 'react'
import { IFetcherSpi } from '@entities/drivers/fetcher/IFetcherSpi'
import { SingleSelectRecordInput } from '@entities/app/page/components/inputs/SingleSelectRecordInput'
import { BaseInputProps } from '@entities/app/page/components/inputs/BaseInput'

export class RenderPageSingleSelectRecordInput {
  constructor(private fetcherSpi: IFetcherSpi) {}

  async execute(
    singleSelectRecordInput: SingleSelectRecordInput
  ): Promise<(props: BaseInputProps) => JSX.Element> {
    const UI = singleSelectRecordInput.renderUI()
    const useSyncRecords = this.fetcherSpi.getSyncRecordsHook([
      { table: singleSelectRecordInput.linkedTable },
    ])
    return function SingleSelectRecordInputComponent(props: BaseInputProps) {
      const { tables } = useSyncRecords()
      const records = tables[singleSelectRecordInput.linkedTable] ?? []
      const options = records.map((record) => ({
        label: String(record.getFieldValue(singleSelectRecordInput.linkedLabelField)),
        value: record.id,
      }))
      return <UI options={options} {...props} />
    }
  }
}
