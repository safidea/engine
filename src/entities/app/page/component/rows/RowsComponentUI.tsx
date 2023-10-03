import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface RowsProps extends BaseComponentProps {
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
