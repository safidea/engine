import React from 'react'
import { IUISpi } from '../../../../drivers/ui/IUISpi'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface LinkProps {
  path: string
  label: string
  ui: IUISpi
}

export function LinkComponentUI({ path, label, ui }: LinkProps) {
  const { Link } = ui.LinkUI
  return <Link href={path}>{label}</Link>
}

export interface LinkUIProps extends BaseComponentUIProps {
  href: string
}
export interface LinkUI {
  Link: React.FC<LinkUIProps>
}
