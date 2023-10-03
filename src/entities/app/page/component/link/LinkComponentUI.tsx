import React from 'react'
import { BaseComponentUIProps } from '../base/BaseComponentUI'
import { BaseComponentProps } from '../base/BaseComponentProps'

export interface LinkProps extends BaseComponentProps {
  path: string
  text: string
}

export function LinkComponentUI({ path, text, ui }: LinkProps) {
  const { Link } = ui.getLink()
  return <Link href={path}>{text}</Link>
}

export interface LinkUIProps extends BaseComponentUIProps {
  href: string
}
export interface LinkUI {
  Link: React.FC<LinkUIProps>
}
