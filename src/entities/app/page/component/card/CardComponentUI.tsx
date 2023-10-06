import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface CardProps extends BaseComponentProps {
  Components: React.FC[]
  style?: {
    card?: UIStyle
  }
}

export function CardComponentUI({ ui, Components, testId, style = {} }: CardProps) {
  const { Card } = ui.getCard()
  return (
    <Card testId={testId} style={style.card}>
      {Components.map((Component, index) => (
        <Component key={index} />
      ))}
    </Card>
  )
}

export interface CardUI {
  Card: React.FC<BaseComponentUIProps>
}
