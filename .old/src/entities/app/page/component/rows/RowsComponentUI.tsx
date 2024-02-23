import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface RowsProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    rows?: UIStyle
    row?: UIStyle
  }
}

export function RowsComponentUI({ Components, ui, style = {} }: RowsProps) {
  const { Rows, Row } = ui.getRows()
  return (
    <Rows style={style.rows}>
      {Components.map((Component, index) => (
        <Row key={index} style={style.row}>
          <Component />
        </Row>
      ))}
    </Rows>
  )
}

export interface RowsUI {
  Rows: React.FC<BaseComponentUIProps>
  Row: React.FC<BaseComponentUIProps>
}
