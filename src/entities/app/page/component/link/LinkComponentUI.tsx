import React from 'react'
import { IUISpi } from '../../../../drivers/ui/IUISpi'
import { BaseUIProps } from '../base/BaseUI'

export interface LinkProps {
  path: string
  label: string
  ui: IUISpi
}

export function LinkComponentUI({ path, label, ui }: LinkProps) {
  const { Link } = ui.LinkUI
  return <Link href={path}>{label}</Link>
}

export interface LinkUIProps extends BaseUIProps {
  href: string
}
export interface LinkUI {
  Link: React.FC<LinkUIProps>
}
