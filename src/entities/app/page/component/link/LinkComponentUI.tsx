import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface LinkProps extends BaseComponentProps {
  display?: 'primary-button' | 'secondary-button'
  path: string
  text: string
}

export function LinkComponentUI({ path, text, ui, display }: LinkProps) {
  const { Link, PrimaryButton, SecondaryButton } = ui.getLink()
  switch (display) {
    case 'primary-button':
      return <PrimaryButton href={path}>{text}</PrimaryButton>
    case 'secondary-button':
      return <SecondaryButton href={path}>{text}</SecondaryButton>
    default:
      return <Link href={path}>{text}</Link>
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
