import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface ContainerProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    container?: UIStyle
    section?: UIStyle
  }
}

export function ContainerComponentUI({ ui, Components, testId, style = {} }: ContainerProps) {
  const { Container, Section } = ui.getContainer()
  return (
    <Container testId={testId} style={style.container}>
      {Components.map((Component, index) => (
        <Section key={index} style={style.section}>
          <Component />
        </Section>
      ))}
    </Container>
  )
}

export interface ContainerUI {
  Container: React.FC<BaseComponentUIProps>
  Section: React.FC<BaseComponentUIProps>
}
