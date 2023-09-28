import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface ColumnProps {
  ui: UIService
  Components: React.FC[]
}

export function ColumnComponentUI({ Components, ui }: ColumnProps) {
  const { Column } = ui.getColumn()
  return (
    <Column>
      {Components.map((Component) => (
        <Component />
      ))}
    </Column>
  )
}

export interface ColumnUI {
  Column: React.FC<BaseComponentUIProps>
}
