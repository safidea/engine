import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ColumnsProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    columns?: {
      background?: {
        color?: 'gray-100'
      }
    }
    column?: string
  }
}

export function ColumnsComponentUI({ Components, ui, style }: ColumnsProps) {
  const { Columns, Column } = ui.getColumns()
  return (
    <Columns style={style?.columns}>
      {Components.map((Component, index) => (
        <Column key={index} number={Components.length} style={style?.column}>
          <Component />
        </Column>
      ))}
    </Columns>
  )
}

export interface ColumnsUIProps extends BaseComponentUIProps {
  style?: {
    background?: {
      color?: 'gray-100'
    }
  }
}

export interface ColumnUIProps extends BaseComponentUIProps {
  number: number
  style?: string
}

export interface ColumnsUI {
  Columns: React.FC<ColumnsUIProps>
  Column: React.FC<ColumnUIProps>
}
