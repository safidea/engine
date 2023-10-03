import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface ContainerProps extends BaseComponentProps {
  Components: React.FC[]
}

export function ContainerComponentUI({ ui, Components, testId }: ContainerProps) {
  const { Container } = ui.getContainer()
  return (
    <Container columns={Components.length} testId={testId}>
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
