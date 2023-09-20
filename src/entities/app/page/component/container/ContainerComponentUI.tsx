import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { UIService } from '@entities/services/ui/UIService'

export interface ContainerProps {
  ui: UIService
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
