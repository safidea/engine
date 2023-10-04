import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ColumnsProps extends BaseComponentProps {
  Components: React.FC[]
}

export function ColumnsComponentUI({ Components, ui }: ColumnsProps) {
  const { Columns, Column } = ui.getColumns()
  return (
    <Columns>
      {Components.map((Component, index) => (
        <Column key={index} number={Components.length}>
          <Component />
        </Column>
      ))}
    </Columns>
  )
}

export interface ColumnUIProps extends BaseComponentUIProps {
  number: number
}

export interface ColumnsUI {
  Columns: React.FC<BaseComponentUIProps>
  Column: React.FC<ColumnUIProps>
}
