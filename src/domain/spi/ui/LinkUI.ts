import { BaseUIProps } from './BaseUI'

export interface LinkUIProps extends BaseUIProps {
  href: string
}
export interface LinkUI {
  link: React.FC<LinkUIProps>
}
