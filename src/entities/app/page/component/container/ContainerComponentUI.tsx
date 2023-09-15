import React from 'react'
import { IUISpi } from '@entities/services/ui/IUISpi'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

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
  Container: React.FC<BaseComponentUIProps>
}
