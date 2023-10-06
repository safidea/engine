import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'

export interface LinkProps extends BaseComponentProps {
  display?: 'primary-button' | 'secondary-button'
  path: string
  text: string
  style?: {
    link?: UIStyle
  }
}

export function LinkComponentUI({ path, text, ui, display, style = {} }: LinkProps) {
  const { Link, PrimaryButton, SecondaryButton } = ui.getLink()
  switch (display) {
    case 'primary-button':
      return (
        <PrimaryButton href={path} style={style.link}>
          {text}
        </PrimaryButton>
      )
    case 'secondary-button':
      return (
        <SecondaryButton href={path} style={style.link}>
          {text}
        </SecondaryButton>
      )
    default:
      return (
        <Link href={path} style={style.link}>
          {text}
        </Link>
      )
  }
}

export interface LinkUIProps extends BaseComponentUIProps {
  href: string
}

export interface LinkUI {
  Link: React.FC<LinkUIProps>
  PrimaryButton: React.FC<LinkUIProps>
  SecondaryButton: React.FC<LinkUIProps>
}
