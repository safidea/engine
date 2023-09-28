import React from 'react'
import { UIService } from '@entities/services/ui/UIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface LinkProps {
  path: string
  text: string
  ui: UIService
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
