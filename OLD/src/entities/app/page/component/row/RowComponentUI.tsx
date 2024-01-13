import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface RowProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    row?: UIStyle
  }
}

export function RowComponentUI({ Components, ui, style = {} }: RowProps) {
  const { Row } = ui.getRow()
  return (
    <Row style={style.row}>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Row>
  )
}

export interface RowUI {
  Row: React.FC<BaseComponentUIProps>
}
