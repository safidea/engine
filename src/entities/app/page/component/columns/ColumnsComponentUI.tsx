import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface ColumnsProps {
  ui: UIService
  Components: React.FC[]
}

export function ColumnsComponentUI({ Components, ui }: ColumnsProps) {
  const { Columns } = ui.getColumns()
  return (
    <Columns>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Columns>
  )
}

export interface ColumnsUI {
  Columns: React.FC<BaseComponentUIProps>
}
