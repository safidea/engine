import React from 'react'
import { IUIService } from '../../../../services/ui/IUIService'
import { BaseComponentUIProps } from '../base/BaseComponentUI'

export interface LinkProps {
  path: string
  label: string
  ui: IUIService
}

export function LinkComponentUI({ path, label, ui }: LinkProps) {
  const { Link } = ui.getLink()
  return <Link href={path}>{label}</Link>
}

export interface LinkUIProps extends BaseComponentUIProps {
  href: string
}
export interface LinkUI {
  Link: React.FC<LinkUIProps>
}
