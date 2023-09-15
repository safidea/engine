import React from 'react'
import { IUIService } from '@entities/services/ui/IUIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface ContainerProps {
  ui: IUIService
  Components: React.FC[]
}

export function ContainerComponentUI({ ui, Components }: ContainerProps) {
  const { Container } = ui.getContainer()
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
