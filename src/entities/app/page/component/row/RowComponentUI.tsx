import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface RowProps {
  ui: UIService
  Components: React.FC[]
}

export function RowComponentUI({ Components, ui }: RowProps) {
  const { Row } = ui.getRow()
  return (
    <Row>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Row>
  )
}

export interface RowUI {
  Row: React.FC<BaseComponentUIProps>
}
