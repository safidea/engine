export interface UIProps {
  children: string | JSX.Element | JSX.Element[]
}

export interface LinkUIProps extends UIProps {
  href: string
}

export interface IUIRepository {
  LinkUI: React.FC<LinkUIProps>
  ParagraphUI: React.FC<UIProps>
}
