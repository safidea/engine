import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface RowsProps extends BaseComponentProps {
  Components: React.FC[]
}

export function RowsComponentUI({ Components, ui }: RowsProps) {
  const { Rows, Row } = ui.getRows()
  return (
    <Rows>
      {Components.map((Component, index) => (
        <Row key={index}>
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
