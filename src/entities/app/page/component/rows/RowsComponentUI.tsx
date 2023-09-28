import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface RowsProps {
  ui: UIService
  Components: React.FC[]
}

export function RowsComponentUI({ Components, ui }: RowsProps) {
  const { Rows } = ui.getRows()
  return (
    <Rows>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Rows>
  )
}

export interface RowsUI {
  Rows: React.FC<BaseComponentUIProps>
}
