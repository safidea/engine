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
    <Container columns={Components.length}>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Container>
  )
}

export interface ContainerUIProps extends BaseComponentUIProps {
  columns: number
}

export interface ContainerUI {
  Container: React.FC<ContainerUIProps>
}
