import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'
import { ButtonSize } from '../button/ButtonComponentParams'
import { LinkDisplay, LinkSize } from './LinkComponentParams'

export interface LinkProps extends BaseComponentProps {
  path: string
  text: string
  size?: LinkSize
  display?: LinkDisplay
  style?: {
    link?: UIStyle
  }
}

export function LinkComponentUI({
  path,
  text,
  ui,
  size = 'medium',
  display = 'link',
  style = {},
}: LinkProps) {
  const { Link, PrimaryButton, SecondaryButton } = ui.getLink()
  switch (display) {
    case 'primary-button':
      return (
        <PrimaryButton href={path} style={style.link} size={size}>
          {text}
        </PrimaryButton>
      )
    case 'secondary-button':
      return (
        <SecondaryButton href={path} style={style.link} size={size}>
          {text}
        </SecondaryButton>
      )
    default:
      return (
        <Link href={path} style={style.link} size={size}>
          {text}
        </Link>
      )
  }
}

export interface LinkUIProps extends BaseComponentUIProps {
  href: string
  size: ButtonSize
}

export interface LinkUI {
  Link: React.FC<LinkUIProps>
  PrimaryButton: React.FC<LinkUIProps>
  SecondaryButton: React.FC<LinkUIProps>
}
