import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ColumnsProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    columns?: UIStyle
    column?: UIStyle
  }
}

export function ColumnsComponentUI({ Components, ui, style = {} }: ColumnsProps) {
  const { Columns, Column } = ui.getColumns()
  return (
    <Columns style={style.columns}>
      {Components.map((Component, index) => (
        <Column key={index} number={Components.length} style={style.column}>
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
