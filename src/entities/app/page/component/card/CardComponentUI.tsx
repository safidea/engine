import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface CardProps extends BaseComponentProps {
  Components: React.FC[]
}

export function CardComponentUI({ ui, Components, testId }: CardProps) {
  const { Card } = ui.getCard()
  return (
    <Card testId={testId}>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Card>
  )
}

export interface CardUI {
  Card: React.FC<BaseComponentUIProps>
}
