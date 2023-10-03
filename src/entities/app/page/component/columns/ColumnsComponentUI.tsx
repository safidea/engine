import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ColumnsProps extends BaseComponentProps {
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
