import React from 'react'
import { IUISpi } from '@entities/drivers/ui/IUISpi'
import { BaseUIProps } from '../base/BaseUI'

export interface ContainerProps {
  ui: IUISpi
  Components: React.FC[]
}

export function ContainerComponentUI({ ui, Components }: ContainerProps) {
  const { Container } = ui.ContainerUI
  return (
    <Container>
      {Components.map((Component) => (
        <Component />
      ))}
    </Container>
  )
}

export interface ContainerUI {
  Container: React.FC<BaseUIProps>
}
