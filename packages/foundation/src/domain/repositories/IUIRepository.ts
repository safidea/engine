export interface UIProps {
  children: string | JSX.Element | JSX.Element[]
}

export interface LinkUIProps extends UIProps {
  href: string
}

export interface IUIRepository {
  LinkUI: React.FC<LinkUIProps>
  ParagraphUI: React.FC<UIProps>
  TitleUI: {
    xs: React.FC<UIProps>
    sm: React.FC<UIProps>
    md: React.FC<UIProps>
    lg: React.FC<UIProps>
    xl: React.FC<UIProps>
  }
  NavigationUI: {
    container: React.FC<UIProps>
    sidebar: React.FC<UIProps>
    links: React.FC<UIProps>
    content: React.FC<UIProps>
  }
}
