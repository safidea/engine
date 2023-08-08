import { BaseUIProps } from './BaseUI'

export interface NavigationUI {
  container: React.FC<BaseUIProps>
  sidebar: React.FC<BaseUIProps>
  links: React.FC<BaseUIProps>
  link: React.FC<BaseUIProps>
  content: React.FC<BaseUIProps>
}
