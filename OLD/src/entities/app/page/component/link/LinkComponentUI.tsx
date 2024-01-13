import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'
import { UIStyle } from '@entities/services/ui/UIStyle'
import { ButtonSize } from '../button/ButtonComponentParams'
import { LinkDisplay, LinkIconPosition, LinkSize } from './LinkComponentParams'

export interface LinkProps extends BaseComponentProps {
  path: string
  text: string
  size?: LinkSize
  display?: LinkDisplay
  Icon?: () => JSX.Element
  position?: LinkIconPosition
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
  Icon,
  position = 'right',
  style = {},
}: LinkProps) {
  const { Link, PrimaryButton, SecondaryButton } = ui.getLink()
  if (Icon) {
    switch (position) {
      case 'left':
        switch (display) {
          case 'primary-button':
            return (
              <PrimaryButton href={path} style={style.link} size={size}>
                <Icon />
                {text}
              </PrimaryButton>
            )
          case 'secondary-button':
            return (
              <SecondaryButton href={path} style={style.link} size={size}>
                <Icon />
                {text}
              </SecondaryButton>
            )
          default:
            return (
              <Link href={path} style={style.link} size={size}>
                <Icon />
                {text}
              </Link>
            )
        }
      case 'right':
        switch (display) {
          case 'primary-button':
            return (
              <PrimaryButton href={path} style={style.link} size={size}>
                {text}
                <Icon />
              </PrimaryButton>
            )
          case 'secondary-button':
            return (
              <SecondaryButton href={path} style={style.link} size={size}>
                {text}
                <Icon />
              </SecondaryButton>
            )
          default:
            return (
              <Link href={path} style={style.link} size={size}>
                {text}
                <Icon />
              </Link>
            )
        }
    }
  }
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
